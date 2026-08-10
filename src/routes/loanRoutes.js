const express = require('express');
const { validateId, validateLoanCreate } = require('../middlewares/validate');

module.exports = (controller) => {
  const router = express.Router();
  router.get('/overdue', controller.overdue);
  router.route('/').get(controller.list).post(validateLoanCreate, controller.create);
  router.get('/:id', validateId, controller.get);
  router.post('/:id/return', validateId, controller.returnBook);
  return router;
};
