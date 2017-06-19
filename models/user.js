const mongoose = require('mongoose');
require('mongoose-type-email');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,'username is required, must not empty'],
    unique:true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: function(input) {
        return /[a-z0-9]{5,}/i.test(input);
      },
      message: '{VALUE} username must consist of 5 character or more (alphanumeric, case-insensitive)'
    }
  },
  email:{
    type:mongoose.SchemaTypes.Email,
    required:[true,'email is required, must not empty'],
    unique:true,
    uniqueCaseInsensitive: true
  },
  password:{
    type:String,
    required:[true,'password is required, must not empty']
  }
}).plugin(uniqueValidator, { message: '{PATH} existed' })

var User = mongoose.model('User',userSchema)

module.exports = User;