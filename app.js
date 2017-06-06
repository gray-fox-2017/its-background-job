const express = require('express');
const bodyParser = require('body-parser');
var app = express()
var mongoose = require('mongoose');
var customers = require('./routes/customers');

var db_config = {
  development: 'mongodb://localhost/cron-kue',
  test: 'mongodb://localhost/cron-kue-test'
}

var current_env = app.settings.env

mongoose.connect(db_config[current_env])


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/customers', customers)

app.listen(3000)

module.exports = app;