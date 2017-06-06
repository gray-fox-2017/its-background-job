require('dotenv').config();
const saltRounds = Number(process.env.SALT_ROUNDS);
const nodemailer = require('nodemailer');

var bcrypt = require('bcrypt');
var CronJob = require('cron').CronJob;
var kue = require('kue')
  , queue = kue.createQueue();
var Customer = require('../models/customer');
let transporter = nodemailer.createTransport({
    service: 'gmail.com',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

var create = function(req, res) {
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(req.body.password, salt);
  let newCustomer = new Customer({
    name: req.body.name,
    email: req.body.email,
    password: hash
  })
  newCustomer.save((err, createdCustomer) => {
    if(err) {
      res.send(err)
    } else {
      new CronJob('00 * * * * *', function() {
        welcomeEmail(createdCustomer)
        this.stop()
      }, null, true, 'Asia/Jakarta');
      res.send(createdCustomer)
    }
  })
}

var get = function(req, res) {
  Customer.find(function (err, customers) {
    res.send(err ? err : customers)
  });
}

var getOne = function(req, res) {
  Customer.find({_id: req.params.id}, (err, customer) => {
    res.send(err ? err: customer)
  })
}

var update = function(req, res) {
  Customer.findByIdAndUpdate(req.params.id, { $set: req.body }, { runValidators: true }, (err, customer) => {
    if(err) res.send(err.errors)
    Customer.findById(customer._id, (err, customer) => {
      res.send(customer)
    })
  })
}

var remove = function(req, res) {
  Customer.findOneAndRemove({_id: req.params.id}, (err, customer) => {
    if(err) res.send(err)
    res.send(customer)
  })
}

var welcomeEmail = function(customer) {
  var job = queue.create('email', {
    to: customer.email,
    subject: 'Welcome to Asal Corp',
    text: `Hai ${customer.name}! Terimakasih sudah bergabung bersama kami. Nantikan promosi-promosi menarik dari kami.`
  }).priority('high').save( function(err){
    if( !err ) console.log(job.id);
  });

  queue.process('email', function(job, done){
    sendEmail(job.data)
  });
}


var sendEmail = function(body) {
  let mailOptions = {
    from: '"Asal Corp 👻" <asalcorp@gmail.com>',
    to: body.to,
    subject: body.subject,
    text: body.text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    done()
  });
}

module.exports = {
  create, get, getOne, update, remove
};