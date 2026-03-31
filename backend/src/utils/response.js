/**
 * Sends a standardized success JSON response.
 *
 * @param {object} res - The Express response object.
 * @param {string} message - A descriptive success message.
 * @param {*} [data] - The payload to send (optional).
 * @param {number} [statusCode=200] - The HTTP status code for the response.
 */
const successResponse = (res, message, data, statusCode = 200) => {
  const response = {
    success: true,
    message: message || 'Operation successful',
  };

  // Only include the data key if data is provided
  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error JSON response.
 *
 * @param {object} res - The Express response object.
 * @param {string} message - A descriptive error message.
 * @param {number} [statusCode=500] - The HTTP status code for the response.
 */
const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message: message || 'An internal server error occurred.',
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
