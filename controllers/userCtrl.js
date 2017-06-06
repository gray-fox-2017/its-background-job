const User = require('../models/user');
const helper = require('../helper/util');
const cronCtrl = require('../controllers/cronCtrl');

const login = (req,res) => {
  User.findOne({username:req.body.username}, (err,user) => {
    if (err || user === null) res.send('Invalid User')
    else if (user !== null) {
      let user_dt = {
        username : user.username,
        id : user._id
      };
      if (helper.checkPassword(req.body.password,user.password)) {
        let token = helper.createToken(user_dt);
        res.send({token : token});
      }
      else res.send({error:'Invalid Login'});
    }
  });
}

const getAll = (req,res) => {
  User.find((err,users)=>{
    res.send(err? {error:err} : users);
  })
}

const getByID = (req,res) => {
  if (req.params.hasOwnProperty('id'))
    User.findById(req.params.id, (err,user) => {
    res.send(err? {error:err} : user);
  })
  else res.send({error:'Invalid ID'})
}

const postUser = (req,res) => {
  let newUser = new User(req.body);
  newUser.save((err,user) => {
    if (err) {
      let err_msg = `err_msg: \n`;
      for (let error in err.errors) err_msg += err.errors[error].message+'\n';
      if (err.code == 11000) err_msg+= `Username already exist`;
      res.send({error:err_msg});
    } else{
      cronCtrl.afterRegister(user);
      res.send(user);
    }
  });
}

const deleteUser = (req,res) => {
  if (req.params.hasOwnProperty('id'))
    User.findById(req.params.id,(err,user)=>{
      if (err) res.send({error:err});
      else {
        user.remove((err,user)=>{
          res.send(err? {error:err} : user);
        })
      }
    })
  else res.send({error: 'Invalid ID'});
}

const putUser = (req,res) => {
  let updUser = new User(req.body);
  if (req.params.hasOwnProperty('id'))
    User.findById(req.params.id,(err,user)=>{
      if (err) res.send({error:err});
      else {
        for (let key in req.body) user[key] = req.body[key]
        user.save((err,user)=>{
          if (err) {
            let err_msg = `err_msg: \n`;
            for (let error in err.errors) err_msg += err.errors[error].message+'\n';
            if (err.code == 11000) err_msg+= `Username already exist`;
            res.send({error:err_msg});
          } else  res.send(user);
        });
      }
    })
  else res.send({error: 'Invalid ID'});
}

module.exports = {
  getAll,
  getByID,
  postUser,
  deleteUser,
  putUser,
  login
}