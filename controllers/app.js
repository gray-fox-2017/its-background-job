const unirest = require('unirest');
const uriencoder = require('helpers/uriencoder');

unirest.get("https://yoda.p.mashape.com/yoda?sentence=You+will+learn+how+to+speak+like+me+someday.++Oh+wait.")
  .header("X-Mashape-Key", "hqcLNYymK8mshr1WONn16eouffPTp1F4mwqjsnMhJEc0RFUA3W")
  .header("Accept", "text/plain")
  .end(function (result) {
      console.log(result.status, result.headers, result.body);
  });
