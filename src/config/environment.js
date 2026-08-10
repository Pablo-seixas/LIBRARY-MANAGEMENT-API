const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management',
  loanDurationDays: Number(process.env.LOAN_DURATION_DAYS) || 14,
  nodeEnv: process.env.NODE_ENV || 'development'
};
