var express = require ('express');
var app = express();
var bodyParser = require('body-parser');



var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cronjob', ()=>{
     console.log('connect to Database');
});


var users = require('./routes/users')



// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use('/users', users);



app.listen(3000, ()=>{
     console.log('live on');
})
