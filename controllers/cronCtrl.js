'use strict'
require('dotenv').config();
const https = require('https');
const cronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const kue = require('kue');
const queue = kue.createQueue();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

const afterRegister = (user) => {
    if (user) {
      let userRegister = new cronJob('* * * * * *' , /* tiap 1 menit */
          function() {
            console.log('scs to start');
            sendEmail(user);
            sendSMS({phone:user.phone,msg:`Hi ${user.username}, Selamat bergabung dengan blog TDD. Semoga tidak jadi CCD`});
            this.stop();
          },
          () => { console.log('stop deh') },
          true, /*start the job right now*/
          'Asia/Jakarta' /*timeZone*/
        );
      // userRegister.start();
    } else console.log('kirim user yang bener laa');

}

const sendEmail = (user) => {
  createJOB('sendEmail',user,'critical');
  queue.process('sendEmail',(job,done)=>{
    let mailOptions = {
        from: '"BLOG_TDD 👻" <noreply@blogtdd.com>', // sender address
        to: `${user.email}`,//`${user.email}`, // list of receivers
        subject: 'Welcome ✔', // Subject line
        text: `Hi ${user.username}, selamat bergabung ke BLOG TDD. Semoga tidak semakin CCD`, // plain text body
        html: `Hi <b>${user.username}</b>,<br/>selamat bergabung ke BLOG TDD. Semoga tidak semakin CCD` // html body
    };
    transporter.sendMail(mailOptions, (err, info) => {
      err ? done(err) : done();
    });

  });
}

const createJOB = (jobname,data,priority='low') => {
  let job =
    queue.create(jobname,data)
    .priority(priority)
    .attempts(5)
    .save(err => console.log(err? err : job.id));

  job.on('complete', res => console.log(`complete\n${res}`));
  job.on('failed', err => console.log(err) );
}

const sendSMS = (user) => {
  // let job =
  createJOB('sendSMS',user,'normal')
  queue.process('sendSMS', (job,done)=> {
    let data = JSON.stringify({
      api_key: process.env.NEXMO_KEY,
      api_secret: process.env.NEXMO_SECRET,
      to: job.data.phone,
      from: 'BLOG_TDD',
      text: job.data.msg
    });
    let options = {
     host: 'rest.nexmo.com',
     path: '/sms/json',
     port: 443,
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Content-Length': Buffer.byteLength(data)
     }
    };
    let req = https.request(options);
    req.write(data);
    req.end();
    let responseData = '';
    req.on('response', (res) => {
      res.on('data', (chunk) => { responseData += chunk;});
      res.on('end', () => { console.log(JSON.parse(responseData)); });
    });
    done();
  });
}

module.exports = {
  afterRegister
}

