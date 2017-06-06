var ObjectId = require('mongodb').ObjectId
var User = require('../models/user')
var passwordHash = require('password-hash')
var CronJob = require('cron').CronJob;
var kue = require('kue')
var queue = kue.createQueue();
require('dotenv').config()
var https = require('https');
const methods = {}

methods.insertUser = function(req, res){
  let mydate = req.body.dob.split('/')
  let minute = mydate[0]
  let hour = mydate[1]
  let date = mydate[2]
  let month = mydate[3]
  // console.log(minute, hour, date, month);
  var userInput = new User({
    username:req.body.username, // untuk login manual
    first_name:req.body.first_name,
    password:passwordHash.generate(req.body.password), // untuk login manual
    dob:req.body.dob
  })

  userInput.save(function(err,userInput){
    if(err){
      return console.log(err);
    } else {
      new CronJob(`1 ${minute} ${hour} ${date} ${month} *`, function() {

        //KUE
        var job = queue.create('sms', {
            first_name:userInput.username,
            text: 'dari nexmo',
            phone: '6285841410308'
        }).save( function(err){
           if( !err ) console.log( job.id );
        });

        //PROCESS KUE
        queue.process('sms', function(job, done){
          var data = JSON.stringify({
           api_key: process.env.KEY,
           api_secret: process.env.SECRET_KEY,
           to: job.data.phone,
           from: '441632960961',
           text: job.data.first_name
          });

          var options = {
           host: 'rest.nexmo.com',
           path: '/sms/json',
           port: 443,
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Content-Length': Buffer.byteLength(data)
           }
          };

          var rekues = https.request(options);

          rekues.write(data);
          rekues.end();

          var responseData = '';
          rekues.on('response', function(data){
           data.on('data', function(chunk){
             responseData += chunk;
           });

           data.on('end', function(){
             console.log(JSON.parse(responseData));
           });
          });
        })

      }, null, true, 'Asia/Jakarta');
      res.send(userInput.username)
    }
  })
}

methods.getAllUsers = function(req, res) {
  User.find(function(err, User) {
    if(err){
      console.log(err);
    } else {
      res.send(User)
    }
  })
}


module.exports = methods
