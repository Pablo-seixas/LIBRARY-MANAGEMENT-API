const { requireFields, validateObjectId, validateEmail, validateIsbn } = require('../validators/common');

const validate = (validator) => (request, response, next) => {
  try {
    validator(request);
    next();
  } catch (error) {
    next(error);
  }
};

const validateId = validate((request) => validateObjectId(request.params.id));
const validateAuthorCreate = validate((request) => requireFields(request.body, ['name']));
const validateUserCreate = validate((request) => {
  requireFields(request.body, ['name', 'email']);
  validateEmail(request.body.email);
});
const validateUserUpdate = validate((request) => request.body.email ? validateEmail(request.body.email) : request.body);
const validateBookCreate = validate((request) => {
  requireFields(request.body, ['title', 'isbn', 'author', 'category', 'totalCopies']);
  request.body.isbn = validateIsbn(request.body.isbn);
  validateObjectId(request.body.author, 'author ID');
});
const validateBookUpdate = validate((request) => {
  request.body.isbn ? request.body.isbn = validateIsbn(request.body.isbn) : null;
  request.body.author ? validateObjectId(request.body.author, 'author ID') : null;
});
const validateLoanCreate = validate((request) => {
  requireFields(request.body, ['userId', 'bookId']);
  validateObjectId(request.body.userId, 'user ID');
  validateObjectId(request.body.bookId, 'book ID');
});

module.exports = {
  validateId,
  validateAuthorCreate,
  validateUserCreate,
  validateUserUpdate,
  validateBookCreate,
  validateBookUpdate,
  validateLoanCreate
};
