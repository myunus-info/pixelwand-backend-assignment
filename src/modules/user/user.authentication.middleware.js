const passport = require('passport');

const AuthStrategy = (req, res, next) => {
  const auth = passport.authenticate('user-jwt', (error, user) => {
    if (error) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ msg: 'Authentication failed' });
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
