const {
  addUser,
  editUser,
  getUsersList,
} = require('../controllers/user/users.controller');
const {
  validateUserInput,
  validateUserUpdateInput,
  validateGetUsersInput,
} = require('../controllers/user/users.middleware');

module.exports = function (app) {
  app.post('/users', validateUserInput, addUser);
  app.patch('/users/:id', validateUserUpdateInput, editUser);
  app.get('/users', validateGetUsersInput, getUsersList);
};
