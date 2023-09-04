const router = require('express').Router();

require('./sample.route')(router);
require('./role.route')(router);

module.exports = {
  router,
};
