const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const users = require('./routes/users')
const app = express()

mongoose.connect('mongodb://localhost/its-background-job', ()=>{
	console.log('Connected to databases')
})
mongoose.Promise = require('bluebird')
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use('/api/users', users)
app.listen(app.get('port'),()=>{
	console.log('Connected to port '+app.get('port'))
})