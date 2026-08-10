const CrudService = require('./CrudService');
const ApiError = require('../utils/ApiError');

class BookService extends CrudService {
  list(filter) { return this.repository.search(filter); }

  create(data) {
    const payload = { ...data, availableCopies: data.availableCopies ?? data.totalCopies };
    return payload.totalCopies >= 0 && payload.availableCopies >= 0 && payload.availableCopies <= payload.totalCopies
      ? super.create(payload)
      : Promise.reject(new ApiError(400, 'Copy quantities are invalid'));
  }

  async update(id, data) {
    const current = await this.get(id);
    const totalCopies = data.totalCopies ?? current.totalCopies;
    const availableCopies = data.availableCopies ?? current.availableCopies;
    return totalCopies >= 0 && availableCopies >= 0 && availableCopies <= totalCopies
      ? super.update(id, data)
      : Promise.reject(new ApiError(400, 'Copy quantities are invalid'));
  }
}

module.exports = BookService;
