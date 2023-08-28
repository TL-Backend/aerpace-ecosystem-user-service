const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const messages = require('./users.constants');
const { validateDataInDBById } = require('./users.helper');
const { dbTables } = require('../../utils/constants');

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
    if (!first_name?.trim() || !typeof first_name === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('first_name'),
      );
    }
    if (!last_name?.trim() || !typeof last_name === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('last_name'),
      );
    }
    if (!country_code?.trim() || !typeof country_code === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('country_code'),
      );
    }
    if (!state?.trim() || !typeof state === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('state'),
      );
    }
    if (!phone_number?.trim() || !typeof phone_number === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('phone_number'),
      );
    }
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email?.trim() || !email.match(validRegex)) {
      errorsList.push(messages.errorMessages.INVAILD_EMAIL_FORMAT_MESSAGE);
    }
    if (!role_id?.trim() || !typeof role_id === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('role_id'),
      );
    }
    const role = await validateDataInDBById(role_id, dbTables.ROLES_TABLE);
    if (!role) {
      errorsList.push(messages.errorMessages.NO_ROLE_FOUND);
    }
    if (!pin_code?.trim() || !typeof pin_code === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('pincode'),
      );
    }
    if (!address?.trim() || !typeof address === 'String') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('address'),
      );
    }
    if (errorsList.length) {
      throw errorsList;
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
    } = req.body;
    const id = req.params.id;
    const errorsList = [];
    const user = await validateDataInDBById(id, dbTables.USERS_TABLE);
    if (!user || !id) {
      errorsList.push(messages.errorMessages.INVAILD_USER_ID_MESSAGE);
    }
    if (
      first_name &&
      (!first_name?.trim() || !typeof first_name === 'String')
    ) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('first_name'),
      );
    }
    if (last_name && (!last_name?.trim() || !typeof last_name === 'String')) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('last_name'),
      );
    }
    if (
      country_code &&
      (!country_code?.trim() || !typeof country_code === 'String')
    ) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('country_code'),
      );
    }
    if (state && (!state?.trim() || !typeof state === 'String')) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('state'),
      );
    }
    if (
      phone_number &&
      (!phone_number?.trim() || !typeof phone_number === 'String')
    ) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('phone_number'),
      );
    }
    if (role_id && (!role_id?.trim() || !typeof role_id === 'String')) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('role_id'),
      );
    }
    if (role_id) {
      const role = await validateDataInDBById(role_id, dbTables.ROLES_TABLE);
      if (!role) {
        errorsList.push(messages.errorMessages.NO_ROLE_FOUND);
      }
    }
    if (pin_code && (!pin_code?.trim() || !typeof pin_code === 'String')) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('pincode'),
      );
    }
    if (address && (!address?.trim() || !typeof address === 'String')) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('address'),
      );
    }
    if (errorsList.length) {
      throw errorsList;
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

exports.validateGetUsersInput = async (req, res, next) => {
  let errorsList = [];
  try {
    const { search, pageLimit, pageNumber } = req.query;
    if (search?.trim() !== ' ' && !typeof search === 'String') {
      errorsList.push(messages.errorMessages.INVAILD_SEARCH_KEY);
    }
    if (pageLimit && (pageLimit < 0 || !typeof pageLimit === 'Number')) {
      errorsList.push(messages.errorMessages.PAGE_LIMIT_MESSAGE);
    }
    if (pageNumber && (pageNumber < 0 || !typeof pageNumber === 'Number')) {
      errorsList.push(messages.errorMessages.PAGE_NUMBER_MESSAGE);
    }
    if (errorsList.length) {
      throw errorsList;
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
