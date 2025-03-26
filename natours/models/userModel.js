const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Emails are required'],
    unique: true,
    lowercase: true,
    validator: {
      validate: function (email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
      },
      message: 'Please enter a valide email address',
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Enter your password'],
    minlength: 8,
    select: false, // Prevents the password from being returned in queries
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (password) {
        return password === this.password;
      },
      message: 'The passwords do not match',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
