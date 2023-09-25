exports.errorMessages = {
  INVAILD_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an string`;
  },
  NO_ROLE_FOUND: 'No role found with this id',
  INVAILD_EMAIL_FORMAT_MESSAGE: 'Invalid email format',
  INVAILD_USER_ID_MESSAGE: 'Invalid user id',
  INVAILD_SEARCH_KEY: 'Invalid search key, it should be string!',
  PAGE_LIMIT_MESSAGE: 'Page limit should be positive',
  PAGE_NUMBER_MESSAGE: 'Page number should be positive',
  INVALID_USER_TYPE_MESSAGE: 'Invalid user type, it must be a string',
  INVALID_ROLE_FOUND: 'Invalid role id format',
  EMAIL_NOT_EDITABLE: 'Email not editable',
  USER_ALREADY_EXIST_WITH_EMAIL: 'User already exist with this email',
  INVALID_ROLE_ID: 'Invalid role_id',
  CREATE_USER_ERROR_FOUND: 'Error while creating user',
  UPDATE_USER_ERROR_FOUND: 'Error while modifying user',
  FETCHING_USERS_ERROR_FOUND: 'Error while fetching data',
  PASSWORD_ADD_ERROR: 'Password cannot be added at the time of user creation'
};

exports.successMessages = {
  USER_ADDED_MESSAGE: 'User created successfully',
  USER_UPDATED_MESSAGE: 'User updated successfully',
  USERS_FETCHED_MESSAGE: 'users fetched successfully',
  DATA_FETCHED_MESSAGE: 'Data fetched sucessfully',
};
