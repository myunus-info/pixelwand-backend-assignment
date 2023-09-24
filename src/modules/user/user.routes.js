const AuthStrategy = require('./user.authentication.middleware');
const userController = require('./user.controller');

module.exports = app => {
  /**
   * @openapi
   * paths:
   *   /api/users:
   *    post:
   *        tags:
   *          - Signup
   *        summary: Register a new user
   *        requestBody:
   *         required: true
   *         description: This route is to register a new user
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/CreateUserInput'
   *        responses:
   *          201:
   *           description: Created
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CreateUserResponse'
   *          409:
   *            description: Confict
   *          400:
   *            description: Bad request
   */
  app.post('/api/users', userController.registerUser);
  /**
   * @openapi
   * paths:
   *   /api/users/login:
   *    post:
   *        tags:
   *          - Login
   *        summary: Login the user
   *        requestBody:
   *         required: true
   *         description: This route is to log in the user
   *         content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/CreateUserLoginInput'
   *        responses:
   *          200:
   *           description: Success
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/CreateUserLoginResponse'
   *          409:
   *            description: Confict
   *          400:
   *            description: Bad request
   */
  app.post('/api/users/login', userController.login);

  /**
   * @openapi
   * paths:
   *   /api/users/logout:
   *    post:
   *        tags:
   *          - Logout
   *        summary: Logout the user
   *        requestBody:
   *         description: This route is to log out the user
   *        responses:
   *          200:
   *           description: Success
   *          409:
   *            description: Confict
   *          400:
   *            description: Bad request
   */
  app.post('/api/users/logout', AuthStrategy, userController.logout);
};
