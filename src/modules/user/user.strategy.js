const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

module.exports = () => {
  const isTokenValid = token => {
    return jwt.verify(token, nodeCache.getValue('JWT_SECRET'));
  };

  const cookieExtractor = req => {
    let token = null;
    if (req && req.signedCookies) {
      const { accessToken, refreshToken } = req.signedCookies;
      if (isTokenValid(accessToken)) {
        token = accessToken;
      } else {
        token = refreshToken;
      }
    }
    return token;
  };

  passport.use(
    'user-jwt',
    new Strategy(
      { secretOrKey: nodeCache.getValue('JWT_SECRET'), jwtFromRequest: cookieExtractor },
      async (payload, done) => {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      }
    )
  );
};
