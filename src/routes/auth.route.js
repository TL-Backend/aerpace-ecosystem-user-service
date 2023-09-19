const {
  login,
  forgotPassword,
  resetPassword,
  getAccessTokenWithRefresh,
  temporarayPasswordReset,
} = require('../controllers/auth/auth.controller');
const {
  loginValidation,
  forgotPasswordValidations,
  resetPasswordValidations,
  refreshTokenValidation,
  temporaryPasswordRestValidation,
} = require('../controllers/auth/auth.middleware');

module.exports = function (router) {
  router.post('/auth/login', loginValidation, login);
  router.post(
    '/auth/forgot-password',
    forgotPasswordValidations,
    forgotPassword,
  );
  router.post('/auth/temporary-password-reset',temporaryPasswordRestValidation,temporarayPasswordReset)
  router.post(
    '/auth/reset-password/:uuid',
    resetPasswordValidations,
    resetPassword,
  );
  router.post(
    '/auth/refresh',
    refreshTokenValidation,
    getAccessTokenWithRefresh,
  );
};
