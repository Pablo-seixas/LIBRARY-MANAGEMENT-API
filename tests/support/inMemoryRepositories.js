const mongoose = require('mongoose');

const copy = (value) => value ? JSON.parse(JSON.stringify(value)) : null;

class InMemoryRepository {
  constructor(uniqueField) {
    this.uniqueField = uniqueField;
    this.items = [];
  }

  async create(data) {
    const duplicate = this.uniqueField && this.items.some((item) => item[this.uniqueField] === data[this.uniqueField]);
    duplicate ? (() => { const error = new Error('Duplicate'); error.code = 11000; error.keyPattern = { [this.uniqueField]: 1 }; throw error; })() : null;
    const now = new Date().toISOString();
    const defaults = this.uniqueField === 'email' ? { status: 'active' } : {};
    const item = { ...defaults, ...copy(data), id: new mongoose.Types.ObjectId().toString(), createdAt: now, updatedAt: now };
    this.items.push(item);
    return copy(item);
  }

  async findAll() { return copy(this.items); }
  async findById(id) { return copy(this.items.find((item) => item.id === String(id))); }

  async update(id, data) {
    const index = this.items.findIndex((item) => item.id === String(id));
    const item = index < 0 ? null : { ...this.items[index], ...copy(data), updatedAt: new Date().toISOString() };
    index < 0 ? null : this.items.splice(index, 1, item);
    return copy(item);
  }

  async delete(id) {
    const index = this.items.findIndex((item) => item.id === String(id));
    return index < 0 ? null : copy(this.items.splice(index, 1)[0]);
  }
}

class InMemoryBookRepository extends InMemoryRepository {
  constructor() { super('isbn'); }

  async search({ title, isbn, author, category } = {}) {
    return copy(this.items.filter((book) =>
      (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
      (!isbn || book.isbn === isbn) &&
      (!author || book.author === author) &&
      (!category || book.category.toLowerCase() === category.toLowerCase())));
  }

  async reserveCopy(id) {
    const book = this.items.find((item) => item.id === String(id) && item.availableCopies > 0);
    book ? book.availableCopies -= 1 : null;
    return copy(book);
  }

  async releaseCopy(id) {
    const book = this.items.find((item) => item.id === String(id) && item.availableCopies < item.totalCopies);
    book ? book.availableCopies += 1 : null;
    return copy(book);
  }
}

class InMemoryLoanRepository extends InMemoryRepository {
  async create(data) { return super.create({ ...data, status: 'active', returnDate: null }); }

  async findAll(filter = {}) {
    const items = this.items.filter((loan) =>
      (!filter.status || loan.status === filter.status) &&
      (!filter.dueDate?.$lt || new Date(loan.dueDate) < filter.dueDate.$lt));
    return copy(items.map((loan) => ({ ...loan, overdue: loan.status === 'active' && new Date(loan.dueDate) < new Date() })));
  }

  findOverdue(now) { return this.findAll({ status: 'active', dueDate: { $lt: now } }); }

  async markReturned(id, returnDate) {
    const loan = this.items.find((item) => item.id === String(id) && item.status === 'active');
    loan ? Object.assign(loan, { status: 'returned', returnDate: returnDate.toISOString() }) : null;
    return copy(loan);
  }
}

module.exports = { InMemoryRepository, InMemoryBookRepository, InMemoryLoanRepository };
