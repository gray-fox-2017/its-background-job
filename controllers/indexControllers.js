var CronJob = require('cron').CronJob;
var kue = require('kue');
var queue = kue.createQueue();
var moment = require('moment')

var sendSMS = function(req,res) {
  res.send('Trigger function');
  new CronJob(`00 45 11 * * *`, function() {
    var job = queue.create('sms', {
    content: `${req.body.title}`,
    to: `${req.body.to}`,
    })
    .save(function(err){
      if(!err) {
        console.log(job.id)
      } else {
        console.log(err);
      }
    });
    //Function to run
    function sms(to,done) {
      var data = JSON.stringify({
       api_key: 'b77bf52a',
       api_secret: 'ca573768f98a3486',
       to: '6282141705406',
       from: 'Testing',
       text: 'Hello from Nexmo by ZAA'
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
      done()
    }
    //Queuing process
    queue.process('sms', function(job, done){
      sms(job.data.to, done);
    });
  },null, true, 'Asia/Jakarta')
}

module.exports = {
  sendSMS
};
