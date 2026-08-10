const BaseRepository = require('./BaseRepository');
const Book = require('../models/Book');

class BookRepository extends BaseRepository {
  constructor() { super(Book); }

  search({ title, isbn, author, category }) {
    const filter = {
      ...(title ? { title: { $regex: title, $options: 'i' } } : {}),
      ...(isbn ? { isbn } : {}),
      ...(author ? { author } : {}),
      ...(category ? { category: { $regex: `^${category}$`, $options: 'i' } } : {})
    };
    return this.model.find(filter).populate('author');
  }

  reserveCopy(id) {
    return this.model.findOneAndUpdate(
      { _id: id, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true, runValidators: true }
    );
  }

  releaseCopy(id) {
    return this.model.findOneAndUpdate(
      { _id: id, $expr: { $lt: ['$availableCopies', '$totalCopies'] } },
      { $inc: { availableCopies: 1 } },
      { new: true, runValidators: true }
    );
  }
}

module.exports = BookRepository;
