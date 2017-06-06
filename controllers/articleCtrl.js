let Article = require('../models/article');
const getAll = (req,res) => {
  Article.find((err,articles)=>{
    res.send(articles);
  })
}
const getByID = (req,res) => {
  // console.log('nemu kah getbyid : '+req.params.hasOwnProperty('id'))
  if (req.params.hasOwnProperty('id')) {
    Article.findById(req.params.id, (err,article) => {
        res.send(err? {error:err} : article)
      }
    )
  } else res.send({error:'ID not defined'})
}
const postArticle = (req,res) => {
  console.log(req.headers.token);
  let newArticle = new Article(req.body);
  // let msg= '';
  newArticle.save((err,article) => {
    res.send(err?{error:err} : article);
  });
}

const putArticle = (req,res) => {
  if (req.params.hasOwnProperty('id')) {
    Article.findById(req.params.id, (err,article) => {
        if (err) res.send({error:err});
        else {
          for(let key in req.body) article[key] = req.body[key];
          article.save((err,article) => {
            // if(!err) article.msg = 'Article updated';
            res.send(err?{error:arr}:article);
          });
        }//end if
      }//end callback
    )//end findbyid
  } else res.send({error:'ID not defined'})
}

const deleteArticle = (req,res) => {
  if (req.params.hasOwnProperty('id')) {
    Article.findById(req.params.id, (err,article)=>{
      if (err) res.send({error : err});
      else {
        article.remove((err,article)=>{
          // if(!err) article.msg = 'Article deleted';
          res.send(err?{error:arr}:article);
        })
      }
    })
  } else res.send({error:'ID not defined'})
}



module.exports = {
  getAll,
  getByID,
  postArticle,
  putArticle,
  deleteArticle
}