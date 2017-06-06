require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const CronJob = require('cron').CronJob;
const kue = require('kue');
const queue = kue.createQueue();
const nodemailer = require('nodemailer');
var d = new Date();
d = new Date(d.getTime() + 1000*5);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.route('/')
.get(function(req, res) {
  res.send('test live');
});

app.route('/')
.post(function(req, res) {
  console.log(d);
  new CronJob(d, function() {
    var job = queue.create('email', {
      subject: 'welcome email for Test CronJob',
      message: `Hi ${req.body.name}, You got this email by registering to my App`,
      to : req.body.email
    }).priority('high')
    .save( function(err){
      if( !err ) console.log("CronJob success!", job.id );
      else console.log(err);
    })
  }, null, true, 'Asia/Jakarta');
  console.log(req.body.email);
  console.log(req.body.name);

  queue.process('email', function(job, done){
    email(job.data, done);
  });

  function email(job, done){
    let transporter = nodemailer.createTransport({
      service : 'gmail.com',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // secure:true for port 465, secure:false for port 587
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Tirta Wirya Putra" <diego.tierta@gmail.com>', // sender address
      to: job.to, // list of receivers
      subject: job.subject, // Subject line
      text: job.message // plain text body
    };

    transporter.verify(function(error, success) {
     if (error) {
      console.log(error);
     } else {
      console.log(success + 'Server is ready to take our messages');
     }
    });

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      } else {
        console.log('Message %s sent: %s', info.messageId, info.response);
        done();
      }
    });
  }
  res.send(req.body);
});

app.listen(3000, () => console.log("Listening on port 3000"));
