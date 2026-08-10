const BaseRepository = require('./BaseRepository');
const Loan = require('../models/Loan');

class LoanRepository extends BaseRepository {
  constructor() { super(Loan); }

  findAll(filter = {}) { return this.model.find(filter).populate('userId').populate('bookId'); }
  findById(id) { return this.model.findById(id).populate('userId').populate('bookId'); }
  findOverdue(now) { return this.findAll({ status: 'active', dueDate: { $lt: now } }); }
  markReturned(id, returnDate) {
    return this.model.findOneAndUpdate(
      { _id: id, status: 'active' },
      { status: 'returned', returnDate },
      { new: true, runValidators: true }
    );
  }
}

module.exports = LoanRepository;
