const asyncHandler = require('../utils/asyncHandler');

const success = (response, data, statusCode = 200) => response.status(statusCode).json({ success: true, data });

const createCrudController = (service) => ({
  create: asyncHandler(async (request, response) => success(response, await service.create(request.body), 201)),
  list: asyncHandler(async (request, response) => success(response, await service.list(request.query))),
  get: asyncHandler(async (request, response) => success(response, await service.get(request.params.id))),
  update: asyncHandler(async (request, response) => success(response, await service.update(request.params.id, request.body))),
  delete: asyncHandler(async (request, response) => success(response, await service.delete(request.params.id)))
});

module.exports = { createCrudController, success };
