const ApiError = require('../utils/ApiError');

class CrudService {
  constructor(repository, resourceName) {
    this.repository = repository;
    this.resourceName = resourceName;
  }

  create(data) { return this.repository.create(data); }
  list(filter) { return this.repository.findAll(filter); }

  async get(id) {
    const item = await this.repository.findById(id);
    return item || Promise.reject(new ApiError(404, `${this.resourceName} not found`));
  }

  async update(id, data) {
    const item = await this.repository.update(id, data);
    return item || Promise.reject(new ApiError(404, `${this.resourceName} not found`));
  }

  async delete(id) {
    const item = await this.repository.delete(id);
    return item || Promise.reject(new ApiError(404, `${this.resourceName} not found`));
  }
}

module.exports = CrudService;
