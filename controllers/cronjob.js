const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
var kue = require('kue')
  , queue = kue.createQueue();

module.exports = {
     cronjob : (response)=>{


     new CronJob('1 21 22 6 5 *', function() {
          // quePromo('Ambo Dalle', 'Silahkan Menunggu', 'ambodalle.st@gmail.com', '0813555804332')
          var job = queue.create('email', {
              subject: 'Selamat bergabung dengan Email Berantai',
              message: `welcome ${response.fullname}, Selamat Bergabung dengan Komunitas Hacktiv8`,
              to : response.email
               })
               .save(function(err){
                  if( !err ) console.log("Cron job sukses", job.id );
               });

          queue.process('email', function(job, done){
          email(job.data, done);
          });


          function email (job, done) {

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
               service : 'gmail',
              host: 'smtp.gmail.com',
              port: 465,
              secure: true, // secure:true for port 465, secure:false for port 587
              auth: {
                  user: 'ambodalle.st@gmail.com',
                  pass: 'alekoe123'
              }
          });

          // setup email data with unicode symbols
          let mailOptions = {
              from: '"Ambo Dalle 👻" <ambodalle.st@gmail.com>', // sender address
              to: job.to, // list of receivers
              subject: job.subject, // Subject line
              text: job.message, // plain text body
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
          });

     }



     }, null, true, 'Asia/Jakarta');
  }
}





//      function quePromo(fullname, pesan, email,phone) {
//           var job = queue.create('emailJob', {
//               fullname: fullname
//             , pesan: pesan
//             , email: email
//             , phone : phone
//           }).save( function(err){
//              if( !err ) console.log( job.id );
//           });
//
//           queue.process('smsJob', function(job, done){
//             smsJob(job.data.to, done);
//       }); //Batas Kue
//
//      }
//
// module.exports = {
//      cronjob : (response) =>{
//
//      }
// }
