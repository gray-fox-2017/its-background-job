var express = require('express');
var router = express.Router();
var indexControllers = require('../controllers/indexControllers')

//Trigger sendSMS function
router.post('/', indexControllers.sendSMS);

module.exports = router;
