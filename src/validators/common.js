const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const fail = (message) => { throw new ApiError(400, message); };

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  return missing.length ? fail(`Required fields: ${missing.join(', ')}`) : body;
};

const validateObjectId = (value, label = 'ID') =>
  mongoose.isValidObjectId(value) ? value : fail(`Invalid ${label}`);

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : fail('Invalid email address');

const validateIsbn = (isbn) => {
  const normalized = String(isbn).replace(/[-\s]/g, '');
  return /^(?:\d{9}[\dX]|\d{13})$/i.test(normalized) ? normalized : fail('Invalid ISBN');
};

module.exports = { requireFields, validateObjectId, validateEmail, validateIsbn };
