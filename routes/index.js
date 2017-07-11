var express = require('express')
var router  = express.Router()
var back_job = require('../controllers/background_job')

router.get('/', function(req, res) {
  res.send('alive')
})

// router.get('/schedule', back_job.schedule_job)

module.exports = router
