const express = require('express');
const { validateId, validateAuthorCreate } = require('../middlewares/validate');

module.exports = (controller) => {
  const router = express.Router();
  router.route('/').get(controller.list).post(validateAuthorCreate, controller.create);
  router.route('/:id').get(validateId, controller.get).put(validateId, controller.update).delete(validateId, controller.delete);
  return router;
};
