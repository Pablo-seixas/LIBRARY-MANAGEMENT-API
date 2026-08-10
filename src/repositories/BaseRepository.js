class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) { return this.model.create(data); }
  findAll(filter = {}) { return this.model.find(filter); }
  findById(id) { return this.model.findById(id); }
  update(id, data) { return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  delete(id) { return this.model.findByIdAndDelete(id); }
}

module.exports = BaseRepository;
