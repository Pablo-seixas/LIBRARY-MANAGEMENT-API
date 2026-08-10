const notFound = (request, response) =>
  response.status(404).json({ success: false, error: 'Route not found' });

module.exports = notFound;
