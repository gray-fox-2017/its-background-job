const simplecrypt = require('simplecrypt');
const User = require('../models/user')

var CronJob = require('cron').CronJob;
var kue = require('kue') , queue = kue.createQueue();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()

let transporter = nodemailer.createTransport({
  service: 'Gmail.com',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS
  }
});

let mailer = function(obj){
  let mailOptions = {
    from: '"ADK App 👻" <tescronjob@gmail.com> ', // sender address
    to: `${obj.to}`, // list of receivers
    subject: `New User Registration ✔ - ${obj.title}`, // Subject line
    text: `${obj.message}`, // plain text body
    html: `<b>${obj.message}<b>` // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      console.log(mailOptions);
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

var createCron = function(obj){
  new CronJob('0 * * * * *', function() {
  // console.log('You will see this message every second');
    createJob(obj)
  }, null, true, 'Asia/Jakarta');
}
var createJob = function(obj){
  var job = queue.create('email', {
    title: 'welcome email',
    to: obj.email,
    message: `Halo ${obj.username}!`
  }).save( function(err){
    if(!err){
      console.log('Data: ', job.data );
      mailer(job.data)
    }
  })
}

module.exports = {
  findAll:(req,res)=>{
    User.find((err,users)=>{
      if(users.length>0){
        res.send(users)
      } else {
        res.send('currently there are no user available')
      }
    });
  },
  create:(req,res)=>{
    if(req.body.password){password=simplecrypt().encrypt(req.body.password)}else{password=req.body.password}
    let user = new User({
      username:req.body.username,
      email:req.body.email,
      password:password
    })
    user.save((err,result)=>{
      if(!err){
        createCron(result)
        res.send(result)
      } else {
        res.send(err.message)
      }
    })
  },
  delete:(req,res)=>{
    User.deleteOne({_id:req.params.id},(err,result)=>{
      if(!err){
        res.send(`Successfully deleted from collection ${result}`)
      } else {
        res.send(err)
      }
    })
  }

};