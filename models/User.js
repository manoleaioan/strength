const mongoose = require('mongoose');
const validator = require('mongoose-validator');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [
      validator({
        validator: 'isEmail'
      })
    ],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [3, 'Username is too short'],
    maxLength: [35, 'Username max length is 35'],
    set: noSpace
  },
  fullName: {
    type: String,
    required: [true, 'Full Name required'],
    lowercase: true,
    trim: true,
    minLength: [3, 'Full Name is too short'],
    maxLength: [35, 'Full Name max length is 35'],
  },
  profilePicture: {
    type: String,
    required: false
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  }
})

function noSpace(v) {
  return v.replace(/\s/g, '');
}

userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { uid: user.id, action: 'verify' },
    process.env.JWTPW,
    { expiresIn: "20m" }
  );
  return verificationToken;
};

userSchema.methods.generateResetPasswordToken = function () {
  const user = this;
  const secretKey = user.password;
  const verificationToken = jwt.sign(
    { uid: user.id, action: 'changepw' },
    secretKey,
    { expiresIn: "20m" }
  );
  return verificationToken;
};

module.exports = mongoose.model('User', userSchema)