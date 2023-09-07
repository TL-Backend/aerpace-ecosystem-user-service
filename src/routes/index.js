const router = require('express').Router();

require('./sample.route')(router);
require('./role.route')(router);
require('./auth.route')(router);
require('./user.route')(router);
require('./config.route')(router);

module.exports = {
  router,
};
