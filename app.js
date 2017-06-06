var express = require('express')


var index = require('./routes/index')
var app = express()

app.use('/', index)

app.listen(3000)

module.exports = app
