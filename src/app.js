const express = require('express');
const defaultServices = require('./services');
const { createCrudController } = require('./controllers/crudController');
const createLoanController = require('./controllers/loanController');
const authorRoutes = require('./routes/authorRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const createApp = (services = defaultServices) => {
  const app = express();
  app.use(express.json());
  app.get('/health', (request, response) => response.json({ success: true, data: { status: 'ok' } }));
  app.use('/api/authors', authorRoutes(createCrudController(services.authorService)));
  app.use('/api/books', bookRoutes(createCrudController(services.bookService)));
  app.use('/api/users', userRoutes(createCrudController(services.userService)));
  app.use('/api/loans', loanRoutes(createLoanController(services.loanService)));
  app.use(notFound);
  app.use(errorHandler);
  return app;
};

module.exports = createApp;
