var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const helper = require('../helper/util');

/* GET users listing. */


router.get('/', userCtrl.getAll);
router.get('/:id',userCtrl.getByID);
router.post('/',userCtrl.postUser);
router.post('/login',userCtrl.login);
router.delete('/:id',userCtrl.deleteUser);
router.put('/:id',userCtrl.putUser);

module.exports = router;
