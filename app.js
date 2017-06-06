const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const kue = require('kue');
const jwt = require('jsonwebtoken');
const cron = require('cron');
const nodemailer = require('nodemailer');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/cronjob1', function(){
	console.log('mongodb success to connect');
})

var user = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/api/user', user);

app.listen(3000, function(){
	console.log('connected on 3000');
});

module.exports = app;


