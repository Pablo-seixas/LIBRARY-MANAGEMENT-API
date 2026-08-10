const environment = require('../config/environment');
const repositories = require('../repositories');
const CrudService = require('./CrudService');
const BookService = require('./BookService');
const LoanService = require('./LoanService');

module.exports = {
  authorService: new CrudService(repositories.authorRepository, 'Author'),
  bookService: new BookService(repositories.bookRepository, 'Book'),
  userService: new CrudService(repositories.userRepository, 'User'),
  loanService: new LoanService({ ...repositories, durationDays: environment.loanDurationDays })
};
