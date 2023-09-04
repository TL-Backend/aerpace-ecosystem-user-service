/**
 * Response handler methods to maintain common response format for all APIs.
 */

const { statusCodes } = require('./statusCodes');

const successResponse = ({
  req,
  res,
  data = {},
  code = statusCodes.STATUS_CODE_SUCCESS,
  message = '',
}) => res.status(code).send({ code, message, data });

const errorResponse = ({
  req,
  res,
  data = {},
  code = statusCodes.STATUS_CODE_FAILURE,
  message = 'Internal server error',
  error = null,
}) => {
  code =
    (error &&
      ((error.error && error.error.code) || error.statusCode || error.code)) ||
    code;
  message =
    message ||
    (error && error.error && error.error.message) ||
    (error && error.message) ||
    '';

  return res.status(code).send({
    code,
    message,
    data,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
