const mongoose = require('mongoose');
const { Schema } = mongoose;
// const { default: mongoose } = require('mongoose');
const { isEmail } = require('validator');

const loginSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please provide a valid email address.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'Password must be at least 6 characters.'],
  },
});

const LoginSchema = mongoose.model('LoginSchema', loginSchema);
module.exports = LoginSchema;
