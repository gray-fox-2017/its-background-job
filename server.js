const CronJob = require('cron').CronJob;
const kue = require('kue')
const queue = kue.createQueue()

var api_key = 'key-d8137f632b7956831b1b9eb1c02e4eba';
var domain = 'sandboxf9795fe0e3614953905866e25e0e31e3.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

function sendEmail(data, done){

  console.log(data);
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    console.log('+++++', error);
  });
  done()
}

function cronprocess() {
  new CronJob('00 55 12 * * *', function() {
    console.log('You will see this message every second');

    var data = {
      from: 'Excited User <postmaster@sandboxea482bc8d8b243ff8513556c82d7441f.mailgun.org>',
      to: 'butetbatak26@gmail.com',
      subject: 'Hello there',
      text: 'Did you get this email!'
    };

    var job = queue.create('email', data).save( function(err){
       if( !err ) console.log( job.id );
    });

  }, null, true, 'Asia/Jakarta');

  queue.process('email', function(job, done){
    console.log('Ini email');
    console.log(job.data);
    sendEmail(job.data, done);
  });
}

cronprocess()
