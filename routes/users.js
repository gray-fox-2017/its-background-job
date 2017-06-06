var express = require('express')
var api = require('../controllers/userController')
var router = express.Router();

router.post('/', api.insertUser)
router.get('/', api.getAllUsers)

module.exports = router
