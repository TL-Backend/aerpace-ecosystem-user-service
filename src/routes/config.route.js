const { getConfig } = require("../controllers/config/config.controller")

module.exports  = function (app) {
  app.get('/users/config', getConfig)
}