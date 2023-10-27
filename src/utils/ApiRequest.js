const rp = require('request-promise');
const { methods, errorResponses } = require('../utils/constant');
const { logger } = require('../utils/logger');

exports.postAsync = async ({
  headers,
  uri,
  body,
  query,
  json = true,
  form,
  formData,
}) => {
  try {
    const postResponse = await this.APIRequest({
      method: methods.POST,
      headers,
      uri,
      body,
      query,
      json,
      form,
      formData,
    });

    let response = {
      data: postResponse.data,
      message: postResponse.message,
      code: postResponse.code,
    };

    return { success: true, data: response };
  } catch (err) {
    logger.error(err.message);

    if (err.statusCode) {
      return {
        success: false,
        data: err.error?.data,
        errorCode: err.statusCode,
        message: err.error?.message,
      };
    }

    return {
      success: false,
      message: errorResponses.SOMETHING_WENT_WRONG,
      errorCode: 500,
    };
  }
};

exports.APIRequest = async ({
  method,
  headers,
  uri,
  body,
  query,
  json = true,
  form,
  formData,
}) => {
  const options = {
    method,
    uri,
    headers,
    body,
    qs: query,
    json,
    form,
    formData,
  };
  return rp(options);
};
