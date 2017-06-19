const mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
  title:String,
  author:String,
  content:String
})

var Article = mongoose.model('Article',articleSchema)

module.exports = Article;