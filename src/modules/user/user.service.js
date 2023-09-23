const path = require('path');
const jwt = require('jsonwebtoken');
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

const generateAccessToken = user => {
  const accessToken = jwt.sign({ id: user._id.toString() }, nodeCache.getValue('JWT_SECRET'), {
    expiresIn: '1h',
    issuer: user._id.toString(),
  });

  return accessToken;
};

const generateRefreshToken = user => {
  const refreshToken = jwt.sign({ id: user._id }, nodeCache.getValue('JWT_SECRET'), {
    expiresIn: '7d',
    issuer: user._id.toString(),
  });
  return refreshToken;
};

const generateLoggedInUser = ({ name, email, _id: userId }) => {
  return { name, email, userId };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateLoggedInUser,
};
