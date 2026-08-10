const express = require('express');
const { validateId, validateBookCreate, validateBookUpdate } = require('../middlewares/validate');

module.exports = (controller) => {
  const router = express.Router();
  router.route('/').get(controller.list).post(validateBookCreate, controller.create);
  router.route('/:id').get(validateId, controller.get).put(validateId, validateBookUpdate, controller.update).delete(validateId, controller.delete);
  return router;
};
