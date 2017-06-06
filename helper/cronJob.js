const CronJob = require('cron').CronJob;
const kue = require('kue')
const queue = kue.createQueue();
const nodemailer = require('nodemailer');
require('dotenv').config();

// var response = {
// 	"name": "Nugraha",
// 	"username": "nunu",
// 	"password": "123456",
// 	"email": "derikurniawan11d88@gmail.com",
// 	"createdAt": new Date()
// }

// console.log(response.name);
// console.log(response.createdAt);

function cronUser(response){
	console.log("ini punya cron job--------------"+response)
	var createdAt = response.createdAt
	var day = createdAt.getDate()
	var month = createdAt.getMonth()
	var hour = createdAt.getHours()
	var minutes = createdAt.getMinutes() + 1

	new CronJob (`0 ${minutes} ${hour} ${day} ${month} *`, function(){
		
		var job = queue.create('email', {
		    title: 'welcome to my website'
		  , message: `Hi ${response.name}, salam kenal. Email ini anda dapatkan dari Deri Kurniawan`
		  ,	to: response.email
		})
		.save( function(err){
		   if( !err ) console.log( "CronJob is success",job.id );
		})

		queue.process('email', function(job, done){
			email(job.data, done);
		})

		function email(job, done){
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				port: 465,
				secure: true, //secure: true for 465, secure:false for port 587
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASS
				}
			});

			let mailOptions = {
			    from: '"Deri Kurniawan 👻" <kuruniawn@gmail.com>', // sender address
			    to: job.to, // list of receivers
			    subject: job.title, // Subject line
			    text: job.message, // plain text body
			    html: '<b>Hallo Salam Kenal, Broder</b>' // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    if (error) {
			        return console.log(error);
			    }
			    console.log('Message %s sent: %s', info.messageId, info.response);
			    return done();
			});
		}

	}, null, true, 'Asia/Jakarta');


}

cronUser(response);
module.exports = cronUser;