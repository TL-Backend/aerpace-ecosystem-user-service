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

module.exports = function (app) {
  app.post('/auth/login', loginValidation, login);
  app.post('/auth/forgot-password', forgotPasswordValidations, forgotPassword);
  app.post(
    '/auth/reset-password/:uuid',
    resetPasswordValidations,
    resetPassword,
  );
  app.get('/auth/refresh', refreshTokenValidation, getAccessTokenWithRefresh);
};
