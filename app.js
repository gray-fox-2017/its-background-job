const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/todos_cron-job', (err)=>{
  if(err){
    console.log(err);
  } else {
    console.log("Connect");
  }
})

var users = require('./routes/users')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.use('/users', users)


app.listen(3000)
module.exports = app
