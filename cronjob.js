var CronJob = require('cron').CronJob;

var kue = require('kue')
  , queue = kue.createQueue();




new CronJob('* 04 11 6 5 *', function() {


     var job = queue.create('sms', {
         title: 'welcome email for tj'
       , to: 'tj@learnboost.com'
       , template: 'welcome-email'
     }).save( function(err){
        if( !err ) console.log( job.id );
     });

     queue.process('sms', function(job, done){
       email(job.data.to, done);
     });

  console.log('You will see this message every second');
}, null, true, 'Asia/Jakarta');
