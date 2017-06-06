require('dotenv').config();
var bcrypt = require('bcrypt');
var chai = require('chai');
var chaiHttp = require('chai-http');
const saltRounds = Number(process.env.SALT_ROUNDS);

chai.use(chaiHttp)

var should = chai.should();

var server = require('../app')
var Customer = require('../models/customer')

describe('Customer API test', () => {
  afterEach(done => {
    Customer.remove({}, (err, res) => {
      done()
    })
  })

  describe('GET /api/customers', () => {
    it('should get all customer', function(done) {
      chai.request(server)
      .get('/api/customers')
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.should.have.lengthOf(0)
        done()
      })
    })
  })

  describe('POST /api/customers', () => {
    afterEach(done => {
      Customer.remove({}, (err, res) => {
        done()
      })
    })
    it('should create new customer', function(done) {
      chai.request(server)
      .post('/api/customers')
      .send({
        name: "Budi Sudarsono",
        email: "budi@gmail.com",
        password: "budi123"
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('name', "Budi Sudarsono")
        res.body.should.have.property('email', "budi@gmail.com")
        res.body.should.have.property('password')
        done()
      })
    })

    it('should return error if name is empty', function(done) {
      chai.request(server)
      .post('/api/customers')
      .send({
        email: "budi@gmail.com",
        password: "budi123"
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        done()
      })
    })

    it('should return error if email is empty', function(done) {
      chai.request(server)
      .post('/api/customers')
      .send({
        name: "Budi Sudarsono",
        password: "budi123"
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        done()
      })
    })

    it('should return error if email is invalid', function(done) {
      chai.request(server)
      .post('/api/customers')
      .send({
        name: "Budi Sudarsono",
        email: "budi",
        password: "budi123"
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        done()
      })
    })
  })

  describe('PUT /api/customers/:id', () => {
    var target;
    before(done => {
      var newCustomer = new Customer({
        name: "Budi Sudarsono",
        email: "budi@gmail.com",
        password: "budi123"
      })
      newCustomer.save((err, saved) => {
        if(err) {
          // console.log(err)
        } else {
          target = saved._id;
          done()
        }
      })
    })
    it('should edit new customer', function(done) {
      chai.request(server)
      .put(`/api/customers/${target}`)
      .send({
        name: "Budi Sudarsonois",
        email: "budi123@gmail.com",
        password: "budi1234"
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('name', "Budi Sudarsonois")
        res.body.should.have.property('email', "budi123@gmail.com")
        res.body.should.have.property('password')
        done()
      })
    })
  })

  describe('DELETE /api/customers/:id', () => {
    var target;
    beforeEach(done => {
      var newCustomer = new Customer({
        name: "Budi Sudarsonois",
        email: "budi@gmail.com",
        password: "budi1234"
      })
      newCustomer.save((err, saved) => {
        if(err) {
          // console.log(err)
        } else {
          target = saved._id;
          done()
        }
      })
    })
    it('should delete the created customer', function(done) {
      chai.request(server)
      .delete(`/api/customers/${target}`)
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
    })
  })
})