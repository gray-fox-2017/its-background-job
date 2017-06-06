const CronJob = require('cron').CronJob
const kue = require('kue')
const queue = kue.createQueue()
const nodemailer = require('nodemailer')
require('dotenv').config()
module.exports = {
	cronUser : (response)=>{
		var createdAt = response.createdAt
		var day = createdAt.getDate()
		var month = createdAt.getMonth()
		var hour = createdAt.getHours()
		var minute = createdAt.getMinutes() + 1

		new CronJob(`0 ${minute} ${hour} ${day} ${month} *`, function() {

			var job = queue.create('email', {
			    subject: 'welcome email for DyK',
			    message: `Hi ${response.name}, Ini email baru dari Dyan Kastutara, Oke Kan?`,
			    to : response.email
				})
				.save( function(err){
				   if( !err ) console.log("Cron job sukses", job.id );
				})
			}, null, true, 'Asia/Jakarta');

			queue.process('email', function(job, done){
		  	email(job.data, done);
			});


			function email(job, done){
				let transporter = nodemailer.createTransport({
        		service : 'gmail',
				    host: 'smtp.gmail.com',
				    port: 587,
				    secure: false, // secure:true for port 465, secure:false for port 587
				    auth: {
				        user: process.env.EMAIL,
				        pass: process.env.PASS
				    }
				});

				// setup email data with unicode symbols
				let mailOptions = {
				    from: '"Dyan Kastutara" <dyankastutara19@gmail.com>', // sender address
				    to: job.to, // list of receivers
				    subject: job.subject, // Subject line
				    text: job.message // plain text body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    if (error) {
				        return console.log(error);
				    }
				    console.log('Message %s sent: %s', info.messageId, info.response);
				    return done()
				});
			}
	}
}
