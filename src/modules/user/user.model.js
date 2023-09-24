const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        name:
 *          type: String
 *          default: Muhammad Yunus
 *        email:
 *          type: String
 *          default: yunus@example.com
 *        password:
 *          type: String
 *          default: My@1245!
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: String
 *        name:
 *          type: String
 *        email:
 *          type: String
 *        accessToken:
 *          type: String
 *    CreateUserLoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: String
 *          default: yunus@example.com
 *        password:
 *          type: String
 *          default: My@1245!
 *    CreateUserLoginResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: String
 *        name:
 *          type: String
 *        email:
 *          type: String
 *        accessToken:
 *          type: String
 *        refreshToken:
 *          type: String
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email'],
    validate: {
      validator: validator.isEmail,
      message: 'The email must be valid',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    validate: {
      validator: validator.isStrongPassword,
      message:
        'Password must be at least 8 characters long, combined with lowercase and uppercase letters, numbers and symbols',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  return await bcrypt.compare(canditatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
