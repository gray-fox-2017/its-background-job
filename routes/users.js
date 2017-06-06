const express = require('express')
const router = express.Router()
const controllersUser = require('../controllers/user')

router.post('/', controllersUser.insert)
router.get('/', controllersUser.getAll)

module.exports = router