const BaseRepository = require('./BaseRepository');
const BookRepository = require('./BookRepository');
const LoanRepository = require('./LoanRepository');
const Author = require('../models/Author');
const User = require('../models/User');

module.exports = {
  authorRepository: new BaseRepository(Author),
  bookRepository: new BookRepository(),
  userRepository: new BaseRepository(User),
  loanRepository: new LoanRepository()
};
