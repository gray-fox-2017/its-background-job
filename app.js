const express = require('express');
const app = express()
const bodyParser = require('body-parser');

const articles = require('./routes/articles');
const users = require('./routes/users');

var mongoose = require('mongoose');

var db_config = {
  development: 'mongodb://localhost/myCronKue',
  test: 'mongodb://localhost/myCronKue-test',
}

var current_env = app.settings.env

mongoose.connect(db_config[current_env],(err,res)=>{
  if (err) {
    console.log(err)
  } else {
    console.log(db_config[current_env])
  }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/api/articles',articles)
app.use('/api/users',users)

app.listen(3000,()=>{
  console.log('server udah jalan cuy!');
})

module.exports = app;