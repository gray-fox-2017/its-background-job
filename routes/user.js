const user = require('../controller/user');
const router = require('express').Router();

router.get('/', user.getAllData);
router.get('/:id', user.getOneData);
router.post('/', user.createData);
// router.path('/:id', user.updateData);
// router.delete('/:id', user.deleteData);

module.exports = router;