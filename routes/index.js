const router = require('express').Router();
const yoda = require('../controllers/yoda');

router.get('/yodasayslove', yoda.sayLove);

module.exports = router;
