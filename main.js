// const CronJob = require('cron').CronJob;
// const kue = require('kue');
// const queue = kue.createQueue();
// const nodemailer = require('nodemailer');
// var d = new Date();
// d.setDate(d.getMinutes() + 1);
//
// $("#regis-button").click(function(event) {
//   let username = $("#username").val();
//   let password = $("#password").val();
//   console.log(username);
//   console.log(password);
//
//   if (username != "" && password != "") {
//     event.preventDefault();
//     alert('Thank you for register, check your email');
//     setTimeout(function() {
//     window.location.href = './index.html';
//     }, 2000);
//   }
//
// });
//
// new CronJob(d, function() {
//     var job = queue.create('sms', {
//         message: 'My first aws sms!',
//         name: 'Bill',
//         phone: '+6287781024364'
//     }).save(function(err) {
//         if (!err) console.log(job.id);
//         console.log('You will see this message every second');
//     });
//     queue.process('sms', function(job, done) {
//         // console.log(job);
//         var params = {
//             Message: `Hi ${job.data.name}, ${job.data.message}`,
//             PhoneNumber: job.data.phone
//         };
//         // console.log(params);
//         sendMessage(params);
//         done()
//     });
// }, null, true, 'Asia/Jakarta');
// function sendMessage(params) {
//     AWS.config.update({
//         accessKeyId: process.env.AWS_KEY,
//         secretAccessKey: process.env.AWS_SECRET,
//         region: "ap-southeast-1"
//     });
//     var sns = new AWS.SNS();
//     console.log(params);
//     sns.publish(params, function(err, data) {
//         console.log('------- Masukk');
//         if (err) console.log(err, err.stack); // an error occurred
//         else console.log(data); // successful response
//     });
// }
