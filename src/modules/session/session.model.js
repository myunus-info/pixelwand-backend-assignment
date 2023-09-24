const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  token: [
    {
      type: String,
      required: true,
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Session', sessionSchema);
