const mongoose = require('mongoose');
const { Schema } = mongoose;
// const { default: mongoose } = require('mongoose');
const { isEmail } = require('validator');
// const bcrypt = require('bcrypt');

// here

const registerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
    trim: true,
  },
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

const RegisterSchema = mongoose.model('RegisterSchema', registerSchema);
module.exports = RegisterSchema;
