const {
  listRoles,
  createRole,
  deleteRole,
  editRole,
} = require('../controllers/role/role.controller');

const {
  validateRoleInput,
  validateUpdateRoleInput,
} = require('../controllers/role/role.middleware');

module.exports = function (app) {
  app.get('/roles', listRoles);
  app.post('/roles', validateRoleInput, createRole);
  app.delete('/roles/:id', deleteRole);
  app.patch('/roles/:id', validateUpdateRoleInput, editRole);
};
