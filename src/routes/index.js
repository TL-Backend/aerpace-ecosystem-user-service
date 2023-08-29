const router = require('express').Router();

require('./sample.route')(router);
require('./roles.route')(router);

module.exports = {
  router,
};
