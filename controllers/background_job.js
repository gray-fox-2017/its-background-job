var CronJob = require('cron').CronJob;
var kue = require('kue');
var queue = kue.createQueue();
var Nexmo = require('nexmo');
var https = require('https');


new CronJob('0 46 04 7 5 *', function() {
    var job = queue.create('sms', {
      // api_key: 'e07e9571',
      // api_secret: '4bf098633d81f485',
      // to: '+6282242361317',
      phone: '+6282242361317',
      text: 'hi erwin how are you'
    })
      // .delay('0')
      // .priority('high')
      .save((err) => {
        if (!err) {
          console.log('sukses !',job.data);
        }
      });

    queue.process('sms', function(job, done){
      var data = JSON.stringify({
        api_key: 'e07e9571',
        api_secret: '4bf098633d81f485',
        to: job.data.phone,
        from: '441632960961',
        text: job.data.text
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
      var req = https.request(options);

      req.write(data);
      req.end();

      var responseData = '';
      req.on('response', function(res){
       res.on('data', function(chunk){
         responseData += chunk;
       });

       res.on('end', function(){
         console.log(JSON.parse(responseData));
       });
      });
      done()

    });

    console.log('You will see this message every second in minutes : 37');
  }, null, true, 'Asia/Jakarta');
