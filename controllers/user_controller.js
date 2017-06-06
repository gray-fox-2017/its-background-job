var User = require('../models/user_model');
var bcrypt = require('bcrypt')
var CronnewJob = require('./cronjob').cronjob


var SignUp = (req,res,next) =>{
     User.findOne({username : req.body.username})
     .then ((docs)=>{
          if(docs) {
               res.send('User name already exists')
          } else {
               User.findOne({email : req.body.email})
               .then((result)=>{
                    console.log(result);
                    if(result) {
                         res.send('This email already exists')
                    } else {
                         var insertUser = new User ({
                              fullname : req.body.fullname,
                              username : req.body.username,
                              email : req.body.email,
                              // password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                              phone : req.body.phone
                         })
                         insertUser.save((err, response)=>{
                              if(err) {
                                   res.send(err.message)
                              } else {
                                   CronnewJob(response)
                                   res.send(response);
                              }
                         })
                    }
               })
               .catch((err) => {
                    res.send(err.message)
               })
          }
     })
     .catch((err) => {
          res.send(err.message);
     })
}

var findAllUsers = (req,res,next)=>{
     User.find({}, (err, docs)=>{
          if(err) {
               res.send(err.message)
          } else {
               res.send(docs)
          }
     })
}

var deleteUser = (req,res,next) =>{
     User.remove({_id:req.params.id}, (err,docs)=>{
          if (err) {
               console.log(err.message);
          } else {
               res.send(docs)
          }
     })
}





module.exports = {
     SignUp,
     deleteUser,
     findAllUsers


}
