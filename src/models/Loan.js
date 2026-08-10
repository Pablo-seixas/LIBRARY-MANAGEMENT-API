const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  loanDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true, index: true },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['active', 'returned'], default: 'active', index: true }
}, { timestamps: true, versionKey: false });

loanSchema.virtual('overdue').get(function getOverdue() { return this.status === 'active' && this.dueDate < new Date(); });
loanSchema.set('toJSON', { virtuals: true, transform: (document, value) => { delete value._id; return value; } });

module.exports = mongoose.model('Loan', loanSchema);
