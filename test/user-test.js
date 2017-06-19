const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp)

var should = chai.should()
var server = require('../app')
var User = require('../models/user')

describe('User',()=>{
  var user_id
  beforeEach('create test user',done=>{
    let dummyUser = new User({
      username:'aaaaa',
      email:'user@email.com',
      password:'asd'
    })
    dummyUser.save((err,result)=>{
      user_id=result._id
      done()
    })
  })
  afterEach('destroy test user',done=>{
    User.remove({},(err)=>{
      done()
    })
  })
  describe('POST /api/users',()=>{
    it('should create a user',done=>{
      chai.request(server)
      .post('/api/users')
      .send({
        username:'bbbbb',
        email:'userB@email.com',
        password:'asd'
      })
      .end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('username')
        res.body.should.have.property('email')
        res.body.should.have.property('password')
        done()
      })
    })
  })
  describe('GET /api/users',()=>{
    it('should get all users',done=>{
      chai.request(server)
      .get('/api/users')
      .end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.should.have.length(1)
        done()
      })
    })
  })
})