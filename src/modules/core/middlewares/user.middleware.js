const path = require('path');
const jwt = require('jsonwebtoken');
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

const generateAccessToken = user => {
  const accessToken = jwt.sign({ id: user._id }, nodeCache.getValue('JWT_SECRET'), {
    expiresIn: nodeCache.getValue('JWT_EXPIRES_IN'),
    issuer: user._id.toString(),
  });
  return accessToken;
};

const generateLoggedInUser = user => {
  return { name: user.username, userId: user._id, role: user.role };
};

module.exports = {
  generateAccessToken,
  generateLoggedInUser,
};
