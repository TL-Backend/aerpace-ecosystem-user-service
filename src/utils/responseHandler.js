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
}) => res.status(code).send({ data, code, message });

const errorResponse = ({
  req,
  res,
  data = {},
  code = statusCodes.STATUS_CODE_FAILURE,
  message = 'Internal server error',
  error = null,
}) => {
  if (error) {
    code = error.error?.code || error.code || error.statusCode || code;
  }

  return res.status(code).send({
    data,
    code,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
