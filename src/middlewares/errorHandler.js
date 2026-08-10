const errorHandler = (error, request, response, next) => {
  const duplicateKey = error?.code === 11000;
  const validationError = error?.name === 'ValidationError';
  const castError = error?.name === 'CastError';
  const statusCode = error.statusCode || (duplicateKey ? 409 : validationError || castError ? 400 : 500);
  const duplicateField = duplicateKey ? Object.keys(error.keyPattern || {})[0] : null;
  const validationMessage = validationError
    ? Object.values(error.errors).map((item) => item.message).join(', ')
    : null;
  const message = duplicateKey
    ? `${duplicateField || 'Resource'} already exists`
    : validationMessage || (castError ? 'Invalid resource ID' : error.message || 'Internal server error');

  response.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
