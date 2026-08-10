const mongoose = require('mongoose');

const connectDatabase = (uri) => mongoose.connect(uri);

const disconnectDatabase = () => mongoose.disconnect();

module.exports = { connectDatabase, disconnectDatabase };
