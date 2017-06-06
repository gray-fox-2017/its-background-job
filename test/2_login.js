const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../app');
let should = chai.should();
const helper = require('../helper/util')

let User = require('../models/user');
let _id;
let _token;

describe('Login', ()=> {


  describe('LOGIN /users',()=>{
    it('should get token after login',(done)=>{
      let login_dt = {
        username: 'lycaans',
        password: 'lycaanspassword'
      }
      chai.request(server)
      .post('/api/users/login')
      .send(login_dt)
      .end((err,user)=>{
        if (err) done(err);
        else if (user.body.hasOwnProperty('error')) done(err);
        else {
          user.should.have.status(200);
          user.body.should.be.a('object');
          user.body.should.have.property('token');
          _token = user.body.token;
          // console.log('token after login: '+_token)
          done();
        }
      });
    });
  });

  after( done => {
    global._token = _token;
    console.log('token after : '+_token)
    done();
  });


})




