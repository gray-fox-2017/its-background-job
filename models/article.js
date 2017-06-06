const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, '{PATH} must be filled'],
    unique: true,
    minlength: [3, '{PATH} must be longer than 2 characters length']
  },
  descr: {
    type: String,
    required: [true, '{PATH} must be filled'],
    minlength: [21, '{PATH} must be longer than 20 characters length']
  },
  author: {
    type: String,
    required: [true, '{PATH} must be filled'],
    minlength: [3, '{PATH} must be longer than 2 characters length']
  },
  createdAt: { type: Date, default: new Date() }
});

let Article = mongoose.model('Article',articleSchema)
module.exports = Article;