const express = require('express');
var router = express.Router()

const User = require('../models/user')

router.get('/',(req,res)=>{
  User.find((err,users)=>{
    if(users.length>0){
      res.send(users)
    } else {
      res.send('currently there are no user available')
    }
  });
})

router.post('/',(req,res)=>{
  let user = new User({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password
  })
  user.save((err,result)=>{
    if(!err){
      res.send(result)
    } else {
      res.send(err.message)
    }
  })
})

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
// router.delete('/:id',(req,res)=>{
//   User.deleteOne({_id:req.params.id},(err,result)=>{
//     if(!err){
//       res.send(`Successfully deleted from collection ${result}`)
//     } else {
//       res.send(err)
//     }
//   })
// })

module.exports = router;