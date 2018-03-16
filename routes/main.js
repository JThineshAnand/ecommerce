var router = require('express').Router();

router.get('/',function(req,res){
  res.render('mains/home');
});

router.get('/about',function(req,res){
  res.render('mains/about');
});

module.exports = router;
