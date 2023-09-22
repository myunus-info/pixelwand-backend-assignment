const path = require('path');
const { generateAccessToken, generateLoggedInUser } = require(path.join(
  process.cwd(),
  'src/modules/core/middlewares/user.middleware'
));
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const User = require('./user.model');

const register = asyncHandler(async (req, res, next) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return next(new AppError(400, 'User already exists!'));
  }
  await User.create({ username, password, role });

  res.status(201).json({
    status: 'success',
    message: 'User created successfully!',
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError(400, 'Please provide both values'));
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError(401, 'Invalid credentials'));
  }
  if (!(await user.comparePassword(password))) {
    return next(new AppError(401, 'Invalid username or password'));
  }

  res.cookie('accessToken', generateAccessToken(user), {
    httpOnly: true,
    sameSite: true,
    signed: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully!',
    user: generateLoggedInUser(user),
  });
});

module.exports = {
  register,
  login,
};
