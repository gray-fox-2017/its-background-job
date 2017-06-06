const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const page_article = {
  method: ['PUT','DELETE','POST']
}

const createToken = (user) => {
  return jwt.sign(user,SECRET_KEY);
}

const hashPassword = (pass) => {
  let encpass= CryptoJS.AES.encrypt(pass, SECRET_KEY).toString();
  return encpass;
}

const checkPassword = (pass,hashPass) => {
  let plainpass = CryptoJS.AES.decrypt(hashPass,SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return plainpass === pass;
}

//cuma di RUD article saja
const authArticle = (req,res,next) => {
  let method = req.method;
  let idx = page_article.method.findIndex(akses=> req.method === akses);
  if (idx !== -1) {
    if (req.body.token) {
      getUserId(req.body.token, (err,decoded)=>{
        console.log(`${decoded._id} == ${req.body.author}`)
        console.log(decoded._id == req.body.author)
        console.log('auth articles');
        if (decoded._id == req.body.author) next();
        else res.send({error: 'You dont have access'})
      })
    }
    else
      res.send({error: 'You must login'});
  }
  else next();
}

const getUserId = (token,callback) => {
  jwt.verify(token,SECRET_KEY, (err,decoded)=>{
    return err? false: decoded;
  })
}

module.exports = {
  hashPassword,
  getUserId,
  createToken,
  authArticle,
  checkPassword
}