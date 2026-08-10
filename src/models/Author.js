const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Author name is required'], trim: true },
  country: { type: String, trim: true },
  birthDate: { type: Date }
}, { timestamps: true, versionKey: false });

authorSchema.set('toJSON', { virtuals: true, transform: (document, value) => { delete value._id; return value; } });

module.exports = mongoose.model('Author', authorSchema);
