const ApiError = require('../utils/ApiError');

class LoanService {
  constructor({ loanRepository, userRepository, bookRepository, durationDays = 14, clock = () => new Date() }) {
    this.loanRepository = loanRepository;
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
    this.durationDays = durationDays;
    this.clock = clock;
  }

  list() { return this.loanRepository.findAll(); }

  async get(id) {
    const loan = await this.loanRepository.findById(id);
    return loan || Promise.reject(new ApiError(404, 'Loan not found'));
  }

  async borrow({ userId, bookId, loanDate, dueDate }) {
    const user = await this.userRepository.findById(userId);
    user ? null : (() => { throw new ApiError(404, 'User not found'); })();
    user.status === 'active' ? null : (() => { throw new ApiError(409, 'Disabled users cannot borrow books'); })();
    const book = await this.bookRepository.findById(bookId);
    book ? null : (() => { throw new ApiError(404, 'Book not found'); })();
    const reservedBook = await this.bookRepository.reserveCopy(bookId);
    reservedBook ? null : (() => { throw new ApiError(409, 'Book is unavailable'); })();
    const borrowedAt = loanDate ? new Date(loanDate) : this.clock();
    const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(borrowedAt.getTime() + this.durationDays * 86400000);

    try {
      return await this.loanRepository.create({ userId, bookId, loanDate: borrowedAt, dueDate: calculatedDueDate });
    } catch (error) {
      await this.bookRepository.releaseCopy(bookId);
      throw error;
    }
  }

  async returnBook(id) {
    const existing = await this.loanRepository.findById(id);
    existing ? null : (() => { throw new ApiError(404, 'Loan not found'); })();
    existing.status === 'active' ? null : (() => { throw new ApiError(409, 'Loan has already been returned'); })();
    const returned = await this.loanRepository.markReturned(id, this.clock());
    returned ? null : (() => { throw new ApiError(409, 'Loan has already been returned'); })();
    await this.bookRepository.releaseCopy(existing.bookId._id || existing.bookId);
    return returned;
  }

  overdue() { return this.loanRepository.findOverdue(this.clock()); }
}

module.exports = LoanService;
