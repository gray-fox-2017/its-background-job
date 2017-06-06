const express = require('express');
var router = express.Router();
var articleCtrl = require('../controllers/articleCtrl');
const helper = require('../helper/util');

// router.use('/',helper.authArticle);
// router.use('/:id',helper.authArticle);

router.get('/',articleCtrl.getAll);
router.get('/:id',articleCtrl.getByID);
router.post('/',articleCtrl.postArticle);
router.put('/:id',articleCtrl.putArticle);
router.delete('/:id',articleCtrl.deleteArticle);

module.exports = router;
