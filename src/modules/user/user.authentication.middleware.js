const passport = require('passport');
const { AppError } = require('../core/errors/');

const AuthStrategy = (req, res, next) => {
  const auth = passport.authenticate('user-jwt', (error, user) => {
    if (error) {
      return next(new AppError(500, 'Internal server error'));
    }
    if (!user) {
      return next(new AppError(401, 'You must login to get access!'));
    }
    req.login(user, { session: false }, err => {
      if (err) {
        return next(err);
      }
      next();
    });
  });

  auth(req, res, next);
};

module.exports = AuthStrategy;
