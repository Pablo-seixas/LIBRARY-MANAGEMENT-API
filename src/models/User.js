const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'User name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' }
}, { timestamps: true, versionKey: false });

userSchema.set('toJSON', { virtuals: true, transform: (document, value) => { delete value._id; return value; } });

module.exports = mongoose.model('User', userSchema);
