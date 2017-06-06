const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helper/util');

let userSchema = new Schema({
  password: {
    type: String,
    required: [true,'{PATH} must be filled'],
    validate: {
      validator: function(val){ return /.{10,20}/.test(val)},
      message: `{PATH}'s length must be between 10 and 20 char`
    }
  },
  email: {
    type: String,
    required: [true,'{PATH} must be filled'],
    validate: {
      validator: function(val){ return /\w{5,20}\@\w{3,20}\.\w{3,20}/.test(val)},
      message: `Invalid {PATH}`
    }
  },
  username: {
    type: String,
    required: [true,'{PATH} must be filled'],
    validate: {
      validator: function(val){ return /[a-z]{3,20}/gi.test(val) },
      message: `{PATH}'s length must be between 3 and 20 char`
    },
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true,'{PATH} must be filled'],
    validate: {
      validator: function(val){ return /\+\d{10,20}/gi.test(val) },
      message: `{PATH}'s length must be between 10 and 20 char with pattern like : +99999999`
    }
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

userSchema.pre('save', function(next) {
  this._doc.password = helper.hashPassword(this._doc.password);
  next();
});

let User = mongoose.model('User',userSchema);
module.exports = User;