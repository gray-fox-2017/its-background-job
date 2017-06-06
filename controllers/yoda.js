const OAuth = require('oauth');
const dotenvConfig = require('dotenv').config();
const uriencoder = require('../helpers/uriencoder');
const unirest = require('unirest');
const CronJob = require('cron').CronJob;
const kue = require('kue'),
  queue = kue.createQueue();

var sayLove = ((req,res) => {
  getQuote((quote) => {
    quote = quote.replace(/<[^>]*>/g, ' ').split('.')[0].trim();
    quote = quote.replace(/' ','+'/g) + '.';
    console.log(quote);
    yodaThinks(quote, (yoda) => {
      console.log(yoda.body);
      dailyScheduler(yoda.body, (data) => {
        res.send(`Tweet is sent! ${data}`);
      });
    });
  });
});

var getQuote = ((callback) => {
  // MAX 10 request per hour - in case of emergency, use the bottom one.
  unirest.get("http://quotes.rest/qod.json?category=love")
    .header("X-Mashape-Key", "hqcLNYymK8mshr1WONn16eouffPTp1F4mwqjsnMhJEc0RFUA3W")
    .header("Accept", "application/json")
    .end(function (result) {
      callback(result.body.contents.quotes[0].quote);
    });
  //unirest.get("http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=xml&lang=en")
  //  .header("Accept", "application/json")
  //  .end(function (result) {
  //    callback(result.body);
  //  });
});

var yodaThinks = ((quote, callback) => {
  unirest.get(`https://yoda.p.mashape.com/yoda?sentence=${quote}`)
    .header("X-Mashape-Key", "hqcLNYymK8mshr1WONn16eouffPTp1F4mwqjsnMhJEc0RFUA3W")
    .header("Accept", "text/plain")
    .end((yoda) => {
      callback(yoda);
    });
});

const oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.consumer_key,
  process.env.consumer_secret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

var dailyScheduler = ((yoda, callback) => {
  new CronJob('0 47 12 * * *', function() {
    var job = queue.create('cheesyYoda', {
      status: `${yoda} #yodasayslove`
    }).save((err) => {
      let body = {status: job.data.status};
      oauth.post(
        `https://api.twitter.com/1.1/statuses/update.json`,
        process.env.access_token,
        process.env.access_token_secret,
        body,
        (err,data) => {
          console.log(err ? err : callback(data));
        });
    });
  }, null, true, 'Asia/Jakarta');
});

module.exports = {
  sayLove
};
