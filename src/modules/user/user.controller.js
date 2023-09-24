const path = require('path');
const { generateAccessToken, generateRefreshToken } = require(path.join(
  process.cwd(),
  '/src/modules/user/user.service.js'
));
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const User = require('./user.model');
const Session = require(path.join(process.cwd(), 'src/modules/session/session.model'));

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError(400, 'User already exists!'));
  }
  const registeredUser = await User.create({ name, email, password });
  const accessToken = generateAccessToken(registeredUser);
  await Session.create({
    token: [accessToken],
    userId: registeredUser._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    user: {
      _id: registeredUser?._id,
      name: registeredUser?.name,
      email: registeredUser?.email,
      accessToken,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(400, 'Please provide both values'));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(401, 'Invalid credentials'));
  }
  if (!(await user.comparePassword(password))) {
    return next(new AppError(401, 'Invalid email or password'));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const session = await Session.findOne({ userId: user._id.toString() });
  session.token.push(accessToken);
  await session.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    signed: true,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    signed: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully!',
    user: {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      accessToken,
      refreshToken,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.signedCookies;
  const { token } = await Session.findOne({ userId: req.user._id.toString() });
  await Session.findOneAndUpdate(
    { userId: req.user._id.toString() },
    { $pull: { token: token.find(t => t === accessToken) } },
    { new: true }
  );
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'User logged out!' });
});

module.exports = {
  registerUser,
  login,
  logout,
};
