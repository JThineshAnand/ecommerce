var router = require('express').Router();
var Category = require('../models/category');

router.get('/add-category',function(req,res,next){
  res.render('admin/add-category',{success:req.flash('success'), failure:req.flash('failure')});
});

router.get('/add-products',function(req,res,next){
  Category.find({},function(err,categories){
    res.render('admin/add-products',{categories:categories, success: req.flash('success')});
  });

});

router.post('/add-category',function(req,res,next){


  Category.findOne({name:req.body.categoryName}, function(err,user){
    if(err)
      return next(err);
    if(user){
      req.flash('failure','Category Already Exists');
      return res.redirect('/add-category');
    }else{
      var category = new Category();
      category.name = req.body.categoryName;
      category.save(function(err){
        if(err)
          return next(err);
        req.flash('success','Successfully added a new Category');
        //res.redirect(`/api/${req.body.categoryName}/${req.body.numberofItems}`)
        return res.redirect('/add-category');
      });
    }
  });
});

module.exports = router;
