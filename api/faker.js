var Product = require('../models/product');
var Category = require('../models/category');
var faker = require('faker');
var router = require('express').Router();
var async = require('async');

router.post('/add-products',function(req,res,next){
//var message = 'success';
  async.waterfall([
    function(callback){
      Category.findOne({name:req.body.categoryName}, function(err,category){
        if(err) return next(err);
        // if(!category)
        //   message = 'failed';
       callback(null,category);
      });
    },
    function(category, callback){

      for(var i = 0;i< req.body.numberofItems; i++){
        var product = new Product();
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.description = faker.commerce.productAdjective();
        product.price = faker.commerce.price();
        product.image = faker.image.image();
        product.save();

      }
      // if(i==31)
      //   message='success';

    }
  ]);

  req.flash('success',`Successfully added ${req.body.numberofItems} Products to ${req.body.categoryName} category`);
  return res.redirect('/add-products');
});

module.exports = router;
