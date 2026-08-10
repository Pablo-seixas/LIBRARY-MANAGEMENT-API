const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Book title is required'], trim: true, index: true },
  isbn: { type: String, required: [true, 'ISBN is required'], unique: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: [true, 'Author is required'], index: true },
  category: { type: String, required: [true, 'Category is required'], trim: true, index: true },
  publicationYear: { type: Number, min: [0, 'Publication year cannot be negative'] },
  totalCopies: { type: Number, required: true, min: [0, 'Total copies cannot be negative'], default: 1 },
  availableCopies: { type: Number, required: true, min: [0, 'Available copies cannot be negative'], default: 1 }
}, { timestamps: true, versionKey: false });

bookSchema.pre('validate', function validateCopies(next) {
  this.availableCopies <= this.totalCopies ? next() : next(new Error('Available copies cannot exceed total copies'));
});
bookSchema.virtual('available').get(function getAvailability() { return this.availableCopies > 0; });
bookSchema.set('toJSON', { virtuals: true, transform: (document, value) => { delete value._id; return value; } });

module.exports = mongoose.model('Book', bookSchema);
