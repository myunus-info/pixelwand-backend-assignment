const userController = require('./user.controller');

module.exports = app => {
  app.post('/api/users', userController.register);
  app.post('/api/users/login', userController.login);
};
