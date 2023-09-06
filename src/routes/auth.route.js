const {
  login,
  forgotPassword,
  resetPassword,
  getAccessTokenWithRefresh,
} = require('../controllers/auth/auth.controller');
const {
  loginValidation,
  forgotPasswordValidations,
  resetPasswordValidations,
  refreshTokenValidation,
} = require('../controllers/auth/auth.middleware');

module.exports = function (router) {
  router.post('/auth/login', loginValidation, login);
  router.post(
    '/auth/forgot-password',
    forgotPasswordValidations,
    forgotPassword,
  );
  router.post(
    '/auth/reset-password/:uuid',
    resetPasswordValidations,
    resetPassword,
  );
  router.get(
    '/auth/refresh',
    refreshTokenValidation,
    getAccessTokenWithRefresh,
  );
};
