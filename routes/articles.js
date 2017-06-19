const express = require('express');
var router = express.Router()


const Article = require('../models/article')

router.get('/',(req,res)=>{
  Article.find((err,articles)=>{
    if(articles.length>0){
      res.send(articles)
    } else {
      res.send('currently there are no article available')
    }
  });
})

router.post('/',(req,res)=>{
  let article = new Article({
    title:req.body.title,
    author:req.body.author,
    content:req.body.content
  })
  article.save((err,result)=>{
    if(!err){
      res.send(result)
    } else {
      res.send(err.message)
    }
  })
})

router.put('/:id',(req,res)=>{
  Article.findById(req.params.id,(err,article)=>{
    article.title=req.body.title||article.title,
    article.author=req.body.author||article.author,
    article.content=req.body.content||article.content
    article.save((err,updatedarticle)=>{
      if(!err){
        res.send(updatedarticle)
      } else {
        res.send(err.message)
      }
    })
  })
})

router.delete('/:id',(req,res)=>{
  Article.deleteOne({_id:req.params.id},(err,result)=>{
    if(!err){
      res.send(`Successfully deleted from collection ${result}`)
    } else {
      res.send(err)
    }
  })
})

module.exports = router;