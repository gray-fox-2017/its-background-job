const express = require('express');
var router = express.Router()

const userController = require('../controllers/userController');

router.get('/',userController.findAll)

router.post('/',userController.create)

// router.put('/:id',(req,res)=>{
//   User.findById(req.params.id,(err,user)=>{
//     user.username=req.body.username||user.username,
//     user.email=req.body.email||user.email,
//     user.password=req.body.password||user.password
//     user.save((err,updatedUser)=>{
//       if(!err){
//         res.send(updatedUser)
//       } else {
//         res.send(err.message)
//       }
//     })
//   })
// })
//
router.delete('/:id',userController.delete)

module.exports = router;