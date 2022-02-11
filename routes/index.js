var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')
var articleModel = require('../models/articles')

router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})

})

router.post('/save-article', async function(req,res,next){

var user = await userModel.findOne({token : req.body.token})
console.log(user)

let articleId;
var articleExists = await articleModel.findOne({title : req.body.title});

if(articleExists == null){

  var saveArticle = new articleModel ({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    image: req.body.image
    });

  var articleSaved = await saveArticle.save();
  articleId = articleSaved._id;

} else {
  articleId = articleExists._id;
  }

  if (!user.userArticles.includes(articleId)){
   user.userArticles.push(articleId);

  var userSaved = await user.save();

  res.json({articleSaved, userSaved})
  } else {
    res.json({error : 'Article déjà enregistré'})
  }

})

router.delete('/delete-article', async function(req,res,next){

  var user = await userModel.findOne({token : req.body.token})

  var myarticle = user.userArticles;

  var articleToDelete = await articleModel.findOne({ title: req.body.title});

  var articleId = articleToDelete._id;

  if(articleToDelete !== null){

    var index = (myarticle.indexOf("articleId"));
    user.userArticles.splice(index, 1);

    var userSaved = await user.save();

    var deleteArticle = await articleModel.deleteOne({ title: req.body.title});

    res.json({delete : true, userSaved, myarticle, deleteArticle})
  } else {
    res.json({delete : false})
  }

  })

  router.get('/wishlist', async function(req,res,next){

    var articlesWishList = [];
    var user = await userModel.findOne({token : req.query.token})
    console.log(user)

    if(user !== null){
      articlesWishList = await userModel.findOne({token : req.query.token}).populate('userArticles');
    }
    res.json({articlesWishList})
  })

// * LANGUAGE ROUTES
// PUT Language
router.put('/last-lang', async function(req,res,next){
  let token = req.body.token
  let lang = req.body.lang
  let updateUser = await userModel.updateOne(
     { token: token},
     { lastLanguage: lang }
  );

  res.json({user: updateUser})
})

// GET Language
router.get('/last-lang', async function(req,res,next) {
  let user = await userModel.findOne({token: req.query.token,})

    if (user.lastLanguage !== null) {
      res.json({result: true, language: user.lastLanguage })
    } else {
      res.json({result: false})
    }
});

module.exports = router;
