const path = require('path');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

module.exports = () => {
  const cookieExtractor = req => {
    let token = null;
    if (req && req.signedCookies) {
      token = req.signedCookies['accessToken'];
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
