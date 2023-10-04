const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const messages = require('./user.constant');

exports.validateUserInput = async (req, res, next) => {
  try {
    const {
      first_name,
      state,
      last_name,
      phone_number,
      email,
      country_code,
      role_id,
      address,
      pin_code,
      user_type,
    } = req.body;
    const errorsList = [];
    if (req.body.password) {
      errorsList.push(messages.errorMessages.PASSWORD_ADD_ERROR);
    }
    if (!first_name?.trim() || typeof first_name !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('first_name'),
      );
    }
    if (user_type && (!user_type?.trim() || typeof user_type !== 'string')) {
      errorsList.push(messages.errorMessages.INVALID_USER_TYPE_MESSAGE);
    }
    if (!last_name?.trim() || typeof last_name !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('last_name'),
      );
    }
    if (!country_code?.trim() || typeof country_code !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('country_code'),
      );
    }
    if (!state?.trim() || typeof state !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('state'),
      );
    }
    if (!phone_number?.trim() || typeof phone_number !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('phone_number'),
      );
    }
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email?.trim() || !email.match(validRegex)) {
      errorsList.push(messages.errorMessages.INVALID_EMAIL_FORMAT_MESSAGE);
    }
    if (
      !role_id?.trim() ||
      typeof role_id !== 'string' ||
      !role_id?.startsWith('r')
    ) {
      errorsList.push(messages.errorMessages.INVALID_ROLE_FOUND);
    }
    if (!pin_code?.trim() || typeof pin_code !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('pincode'),
      );
    }
    if (!address?.trim() || typeof address !== 'string') {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('address'),
      );
    }
    if (errorsList.length) {
      throw errorsList.join(' ,');
    }
    return next();
  } catch (error) {
    logger.error(error);
    console.log('type of error', typeof error);
    return errorResponse({
      req,
      res,
      error,
      message: error,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};

exports.validateUserUpdateInput = async (req, res, next) => {
  try {
    const {
      first_name,
      state,
      phone_number,
      country_code,
      role_id,
      address,
      pin_code,
      last_name,
      email,
    } = req.body;
    const id = req.params.id;
    const errorsList = [];
    if (req.body.password) {
      errorsList.push(messages.errorMessages.PASSWORD_ADD_ERROR);
    }
    if (!id?.trim() || typeof id !== 'string' || !id.startsWith('u')) {
      errorsList.push(messages.errorMessages.INVALID_USER_ID_MESSAGE);
    }
    if (first_name && (!first_name?.trim() || typeof first_name !== 'string')) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('first_name'),
      );
    }
    if (last_name && (!last_name?.trim() || typeof last_name !== 'string')) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('last_name'),
      );
    }
    if (
      country_code &&
      (!country_code?.trim() || typeof country_code !== 'string')
    ) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('country_code'),
      );
    }
    if (state && (!state?.trim() || typeof state !== 'string')) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('state'),
      );
    }
    if (
      phone_number &&
      (!phone_number?.trim() || typeof phone_number !== 'string')
    ) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('phone_number'),
      );
    }
    if (
      role_id &&
      (!role_id?.trim() ||
        typeof role_id !== 'string' ||
        !role_id?.startsWith('r'))
    ) {
      errorsList.push(messages.errorMessages.INVALID_ROLE_FOUND);
    }
    if (pin_code && (!pin_code?.trim() || typeof pin_code !== 'string')) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('pincode'),
      );
    }
    if (address && (!address?.trim() || typeof address !== 'string')) {
      errorsList.push(
        messages.errorMessages.INVALID_STRING_OR_MISSING_ERROR('address'),
      );
    }
    if (email) {
      errorsList.push(messages.errorMessages.EMAIL_NOT_EDITABLE);
    }
    if (errorsList.length) {
      throw errorsList.join(' ,');
    }
    return next();
  } catch (error) {
    logger.error(error);
    console.log('type of error', typeof error);
    return errorResponse({
      req,
      res,
      error,
      message: error,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};

exports.validateGetUsersInput = async (req, res, next) => {
  let errorsList = [];
  try {
    const { search, page_limit, page_number } = req.query;
    if (search && typeof search !== 'string') {
      errorsList.push(messages.errorMessages.INVALID_SEARCH_KEY);
    }
    if (page_limit && page_limit < 0) {
      errorsList.push(messages.errorMessages.PAGE_LIMIT_MESSAGE);
    }
    if (page_number && page_number < 0) {
      errorsList.push(messages.errorMessages.PAGE_NUMBER_MESSAGE);
    }
    if (errorsList.length) {
      throw errorsList.join(' ,');
    }
    return next();
  } catch (error) {
    logger.error(error);
    return errorResponse({
      req,
      res,
      error,
      message: error,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
