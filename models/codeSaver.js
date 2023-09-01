const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Set the expiration time to 10 minutes (in seconds)
  },
});

const CodeSaver = mongoose.model('CodeSaver', verificationSchema);

module.exports = CodeSaver;
