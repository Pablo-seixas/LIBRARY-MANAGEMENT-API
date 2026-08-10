const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const createApp = require('../src/app');
const CrudService = require('../src/services/CrudService');
const BookService = require('../src/services/BookService');
const LoanService = require('../src/services/LoanService');
const { InMemoryRepository, InMemoryBookRepository, InMemoryLoanRepository } = require('./support/inMemoryRepositories');

chai.use(chaiHttp);
const { expect } = chai;

describe('Library Management API', function suite() {
  let app;
  let author;
  let book;
  let user;

  beforeEach(async function resetDatabase() {
    const authorRepository = new InMemoryRepository();
    const bookRepository = new InMemoryBookRepository();
    const userRepository = new InMemoryRepository('email');
    const loanRepository = new InMemoryLoanRepository();
    app = createApp({
      authorService: new CrudService(authorRepository, 'Author'),
      bookService: new BookService(bookRepository, 'Book'),
      userService: new CrudService(userRepository, 'User'),
      loanService: new LoanService({ loanRepository, userRepository, bookRepository })
    });
    author = (await chai.request(app).post('/api/authors').send({ name: 'Ursula K. Le Guin', country: 'United States' })).body.data;
    book = (await chai.request(app).post('/api/books').send({
      title: 'A Wizard of Earthsea',
      isbn: '9780547773742',
      author: author.id,
      category: 'Fantasy',
      publicationYear: 1968,
      totalCopies: 2
    })).body.data;
    user = (await chai.request(app).post('/api/users').send({ name: 'Alex Reader', email: 'alex@example.com' })).body.data;
  });

  it('creates a book with all copies available', async function test() {
    expect(book).to.include({ title: 'A Wizard of Earthsea', availableCopies: 2, totalCopies: 2 });
  });

  it('retrieves and searches books', async function test() {
    const response = await chai.request(app).get('/api/books').query({ title: 'wizard', category: 'fantasy' });
    expect(response).to.have.status(200);
    expect(response.body.data).to.have.length(1);
    const single = await chai.request(app).get(`/api/books/${book.id}`);
    expect(single.body.data.isbn).to.equal('9780547773742');
  });

  it('updates a book', async function test() {
    const response = await chai.request(app).put(`/api/books/${book.id}`).send({ category: 'Classic Fantasy' });
    expect(response.body.data.category).to.equal('Classic Fantasy');
  });

  it('deletes a book', async function test() {
    expect(await chai.request(app).delete(`/api/books/${book.id}`)).to.have.status(200);
    expect(await chai.request(app).get(`/api/books/${book.id}`)).to.have.status(404);
  });

  it('creates and retrieves a user', async function test() {
    expect(user).to.include({ name: 'Alex Reader', status: 'active' });
    expect(await chai.request(app).get(`/api/users/${user.id}`)).to.have.status(200);
  });

  it('creates a loan, calculates its due date, and decreases availability', async function test() {
    const response = await chai.request(app).post('/api/loans').send({ userId: user.id, bookId: book.id });
    expect(response).to.have.status(201);
    expect(response.body.data.status).to.equal('active');
    const updatedBook = await chai.request(app).get(`/api/books/${book.id}`);
    expect(updatedBook.body.data.availableCopies).to.equal(1);
    expect(new Date(response.body.data.dueDate) - new Date(response.body.data.loanDate)).to.equal(14 * 86400000);
  });

  it('returns a book and restores availability', async function test() {
    const loan = (await chai.request(app).post('/api/loans').send({ userId: user.id, bookId: book.id })).body.data;
    const response = await chai.request(app).post(`/api/loans/${loan.id}/return`);
    expect(response.body.data.status).to.equal('returned');
    expect(response.body.data.returnDate).to.be.a('string');
    const updatedBook = await chai.request(app).get(`/api/books/${book.id}`);
    expect(updatedBook.body.data.availableCopies).to.equal(2);
  });

  it('rejects a duplicate return', async function test() {
    const loan = (await chai.request(app).post('/api/loans').send({ userId: user.id, bookId: book.id })).body.data;
    await chai.request(app).post(`/api/loans/${loan.id}/return`);
    const response = await chai.request(app).post(`/api/loans/${loan.id}/return`);
    expect(response).to.have.status(409);
  });

  it('rejects loans for missing users', async function test() {
    const response = await chai.request(app).post('/api/loans').send({ userId: new mongoose.Types.ObjectId(), bookId: book.id });
    expect(response).to.have.status(404);
    expect(response.body.error).to.equal('User not found');
  });

  it('rejects loans for disabled users', async function test() {
    await chai.request(app).put(`/api/users/${user.id}`).send({ status: 'disabled' });
    const response = await chai.request(app).post('/api/loans').send({ userId: user.id, bookId: book.id });
    expect(response).to.have.status(409);
  });

  it('rejects loans when no copies are available', async function test() {
    await chai.request(app).put(`/api/books/${book.id}`).send({ availableCopies: 0 });
    const response = await chai.request(app).post('/api/loans').send({ userId: user.id, bookId: book.id });
    expect(response).to.have.status(409);
    expect(response.body.error).to.equal('Book is unavailable');
  });

  it('lists overdue active loans', async function test() {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    await chai.request(app).post('/api/loans').send({ userId: user.id, bookId: book.id, dueDate: yesterday });
    const response = await chai.request(app).get('/api/loans/overdue');
    expect(response).to.have.status(200);
    expect(response.body.data).to.have.length(1);
    expect(response.body.data[0].overdue).to.equal(true);
  });

  it('rejects malformed resource IDs', async function test() {
    const response = await chai.request(app).get('/api/books/not-an-id');
    expect(response).to.have.status(400);
    expect(response.body.error).to.equal('Invalid ID');
  });

  it('returns 404 for unknown routes', async function test() {
    const response = await chai.request(app).get('/api/unknown');
    expect(response).to.have.status(404);
    expect(response.body).to.deep.equal({ success: false, error: 'Route not found' });
  });

  it('validates required fields and email addresses', async function test() {
    expect(await chai.request(app).post('/api/books').send({ title: 'Incomplete' })).to.have.status(400);
    expect(await chai.request(app).post('/api/users').send({ name: 'Invalid', email: 'invalid' })).to.have.status(400);
  });

  it('validates ISBN values and copy quantities', async function test() {
    const invalidIsbn = await chai.request(app).post('/api/books').send({ title: 'Bad', isbn: '123', author: author.id, category: 'Test', totalCopies: 1 });
    expect(invalidIsbn).to.have.status(400);
    const invalidCopies = await chai.request(app).put(`/api/books/${book.id}`).send({ availableCopies: 3 });
    expect(invalidCopies).to.have.status(400);
  });

  it('rejects duplicate emails and ISBNs', async function test() {
    const duplicateUser = await chai.request(app).post('/api/users').send({ name: 'Other', email: 'alex@example.com' });
    expect(duplicateUser).to.have.status(409);
    const duplicateBook = await chai.request(app).post('/api/books').send({ title: 'Other', isbn: book.isbn, author: author.id, category: 'Fantasy', totalCopies: 1 });
    expect(duplicateBook).to.have.status(409);
  });
});
