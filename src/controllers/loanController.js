const asyncHandler = require('../utils/asyncHandler');
const { success } = require('./crudController');

const createLoanController = (service) => ({
  create: asyncHandler(async (request, response) => success(response, await service.borrow(request.body), 201)),
  list: asyncHandler(async (request, response) => success(response, await service.list())),
  get: asyncHandler(async (request, response) => success(response, await service.get(request.params.id))),
  returnBook: asyncHandler(async (request, response) => success(response, await service.returnBook(request.params.id))),
  overdue: asyncHandler(async (request, response) => success(response, await service.overdue()))
});

module.exports = createLoanController;
