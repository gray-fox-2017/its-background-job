const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../app');
let should = chai.should();
const helper = require('../helper/util')

let User = require('../models/user');
let _id;
let _token;

describe('User', ()=> {

  before( done => {
    User.remove({}, err=>{done();});
    // module.exports = _token;
    // console.log('token after : '+_token)
    // done();
  });

  describe('GET /users', ()=>{
    it('should get all users', (done) => {
      chai.request(server)
      .get('/api/users')
      .end((err,users)=>{
        if (err) done(err);
        else if (users.body.hasOwnProperty.hasOwnProperty('error')) done(err);
        else {
          users.should.have.status(200);
          users.body.should.be.a('array');
          users.body.length.should.eql(0);
          done();
        }
      })
    })
  });

  describe('POST /users', () => {
    it('should insert new user', (done)=> {
      let newUser = {
        username: 'lycaa',
        password: 'lycaapassword'
      }
      chai.request(server)
      .post('/api/users')
      .send(newUser)
      .end((err,user)=>{
        if (err) done(err);
        else if (user.body.hasOwnProperty('error')) done(err);
        else {
          user.should.have.status(200);
          user.body.should.be.a('object');
          user.body.should.have.property('username');
          user.body.should.have.property('password');
          user.body.should.have.property('_id');
          user.body.should.have.property('createdAt');
          _id = user.body._id;
          // console.log('habis post: '+_id);
          done();
        }

      })
    })
  });

  // console.log('_id: '+_id);
  describe('GET /users:id', ()=>{
    it('should getUserByID', (done)=> {
      chai.request(server)
      .get(`/api/users/${_id}`)
      .end((err,user)=>{
        if (err) done(err);
        else if (user.body.hasOwnProperty('error')) done(err);
        else {
          user.should.have.status(200);
          user.body.should.be.a('object');
          user.body.should.have.property('_id').eql(_id);
          done();
        }
      })
    })
  });

  describe('PUT /users:id', ()=>{
    it('should updateUserByID', (done)=> {
      let updUser = {
        username: 'lycaans',
        password: 'lycaanspassword'
      }
      chai.request(server)
      .put(`/api/users/${_id}`)
      .send(updUser)
      .end((err,user)=> {
        if (err) done(err);
        else if (user.body.hasOwnProperty('error')) done(err);
        else {
          user.should.have.status(200);
          user.body.should.be.a('object');
          user.body.should.have.property('_id').eql(_id);
          done();
        }
      })
    })
  });

  // describe('DELETE /users:id', ()=>{
  //   it('should delete by users id', (done)=> {
  //     chai.request(server)
  //     .delete(`/api/users/${_id}`)
  //     .end((err,user)=> {
  //       if (err) done(err);
  //       else if (user.body.hasOwnProperty('error')) done(err);
  //       else {
  //         user.should.have.status(200);
  //         user.body.should.be.a('object');
  //         user.body.should.have.property('_id').eql(_id);
  //         done();
  //       }
  //     })
  //   })
  // });

  // describe('LOGIN /users',()=>{
  //   it('should get token after login',(done)=>{
  //     let login_dt = {
  //       username: 'lycaans',
  //       password: 'lycaanspassword'
  //     }
  //     chai.request(server)
  //     .post('/api/users/login')
  //     .send(login_dt)
  //     .end((err,user)=>{
  //       if (err) done(err);
  //       else if (user.body.hasOwnProperty('error')) done(err);
  //       else {
  //         user.should.have.status(200);
  //         user.body.should.be.a('object');
  //         // let nid;
  //         user.body.should.have.property('token');
  //         _token = user.body.token;
  //         console.log('token after login: '+_token)
  //         done();
  //         // helper.getUserId(user.body.token, (err,decoded)=> {
  //         //
  //         //   nid = decoded.id;
  //         //   console.log('nid: '+nid);
  //         // });
  //
  //
  //
  //       }
  //     });
  //   });
  // });




})




