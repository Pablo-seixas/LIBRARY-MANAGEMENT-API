const express = require('express');
const { validateId, validateUserCreate, validateUserUpdate } = require('../middlewares/validate');

module.exports = (controller) => {
  const router = express.Router();
  router.route('/').get(controller.list).post(validateUserCreate, controller.create);
  router.route('/:id').get(validateId, controller.get).put(validateId, validateUserUpdate, controller.update);
  return router;
};
