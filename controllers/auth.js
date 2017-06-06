'use strict'
require('dotenv').config();
const secret = process.env.TOKEN_SECRET;
const saltRounds = 10

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail.com',
  auth:{
    user: process.env.user_email,
    pass: process.env.password
  }
})

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var User = require('../models/user');
var methods = {}

// background job here
var CronJob = require('cron').CronJob;
var kue = require('kue')
  , queue = kue.createQueue();

methods.login = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username})
  .then(user => {
    if(user == null){
      res.send('no such user')
    } else {
      bcrypt.compare(password, user.password)
      .then(result => {
        if(result) {
          var token = jwt.sign({id: user.id, email: user.email, username: user.username}, secret);
          res.send(token);
        } else {
          console.log(result);
          res.send("password is incorrect");
        }
      })
      .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err))
}

methods.signup = (req, res) => {
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hash,
    email: req.body.email,
    fb_account: false
  })
  .then(response => {
    res.send('User created');

    var cronJobTime = new Date();
    cronJobTime = new Date(cronJobTime.getTime() + 1000*5);

    // run background job
    // send email
    var job = new CronJob(cronJobTime, function() {
        welcomeEmail(response)
        console.log(`Thanks for registering, ${response.username}`);
        this.stop()
      }, function () {
        console.log('crown job is done!');
      },
      true, /* Start the job right now */
      'Asia/Jakarta' /* Time zone of this job. */
    );

  })
  .catch(err => {
    console.log(err);
    if(/username/.test(err.message)){
      res.send('username already taken')
    }
    else if(/email_1/.test(err.message)){
      res.send('email is already registered')
    }
    else {
      res.send(err.message)
    }
  })
}

methods.authUser = (req, res, next) => {
  let token = req.headers.token
  if(token){
    jwt.verify(token, secret, (err, decoded) => {
      if(decoded.id == req.params.id){
        req.body.token = token;
        next()
      } else {
        res.send('not authorized')
      }
    })
  } else {
    res.send('Please login first')
  }
}

methods.allUser = (req, res, next) => {
  let token = req.headers.token
  if(token){
    jwt.verify(token, secret, (err, decoded) => {
      if(decoded){
        req.body.token = token;
        next()
      } else {
        res.send('not authorized')
      }
    })
  } else {
    res.send('Please login first')
  }
}

function welcomeEmail(data){
  var job = queue.create('email', {
    username: data.username,
    email: data.email
  }).save( function(err){
    if( !err ) console.log( job.id );
  });

  queue.process('email', function(job, done){
    sendEmail(job.data);
    done()
  });
}

function sendEmail(data) {
  var mailOptions = {
    from: '"MyMemo App" <mymemo@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: 'Welcome to MyMemo', // Subject line
    text: 'congratulation you are registered', // plain text body
    html: '<b>This is test email!</b>' // html body
  }
  transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(`Email has been send to ${data.email}`);
    }
  })
}


module.exports = methods
