"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const index = require('./routes/index');

app.use('/', index);

app.listen(3000);

module.exports = app;
