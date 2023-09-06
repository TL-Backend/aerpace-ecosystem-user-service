const router = require('express').Router();

require('./sample.route')(router);
require('./auth.route')(router);
require('./user.route')(router);


module.exports = {
  router,
};
