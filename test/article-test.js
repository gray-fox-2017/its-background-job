const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp)

var should = chai.should()
var server = require('../app')
var Article = require('../models/article')

describe('Article',()=>{
  var article_id
  beforeEach('create test article',done=>{
    let dummyArticle = new Article({
      title:'This is the title',
      author:'Jane Doe',
      content:'Alalalalala Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    })
    dummyArticle.save((err,result)=>{
      article_id=result._id
      done()
    })
  })
  afterEach('destroy test article',done=>{
    Article.remove({},(err)=>{
      done()
    })
  })
  describe('POST /api/articles',()=>{
    it('should create an article',done=>{
      chai.request(server)
      .post('/api/articles')
      .send({
        title:'Artikel pertamaku',
        author:'John Doe',
        content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      })
      .end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('title')
        res.body.should.have.property('author')
        res.body.should.have.property('content')
        done()
      })
    })
  })
  describe('GET /api/articles',()=>{
    it('should get all articles',done=>{
      chai.request(server)
      .get('/api/articles')
      .end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.should.have.length(1)
        done()
      })
    })
  })
  describe('PUT /api/articles/id',()=>{
    it('should get update an article',done=>{
      chai.request(server)
      .put(`/api/articles/${article_id}`)
      .send({
        content:'asdfgh'
      })
      .end((err,res)=>{
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('title')
        res.body.should.have.property('author')
        res.body.should.have.property('content')
        done()
      })
    })
  })
  describe(`DELETE /api/articles/id`,()=>{
    it('should get delete an article',done=>{
      chai.request(server)
      .delete(`/api/articles/${article_id}`)
      .end((err,res)=>{
        res.should.have.status(200)
        res.text.should.be.a('string')
        done()
      })
    })
  })

})
