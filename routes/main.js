var router = require('express').Router();
var Product = require('../models/product');

Product.createMapping(function(err,mapping){
  if(err) console.log('Cannot create Mapping');
  else console.log(mapping);
});

var stream = Product.synchronize();
var count =0;

stream.on('data',function(){
  count++;
});

stream.on('close',function(){
  console.log(`Indexed ${count} documents`);

});

stream.on('error',function(err){
  console.log('Cannot index documents');
  console.log(err);
});



function paginate(req,res,next){
  var page = req.params.page;
  var perPage =9;
  Product
    .find()
    .skip(page * perPage)
    .limit(perPage)
    .populate('category')
    .exec(function(err, products){
      if(err) return next(err);
      console.log(products);
      Product.count().exec(function(err,count){
        if(err) return next(err);
        else {
           return res.render('mains/products-main',{
            products:products,
            pages: count/perPage,

          });
        }
      });
    });
}

router.get('/',function(req,res,next){
  if(req.user){
    paginate(req,res,next);
  }
  else
  res.render('mains/home');
});

router.get('/page/:page',function(req,res,next){
  if(req.user){
    paginate(req,res,next);
  }
  else
  res.render('mains/home');
});

router.get('/about',function(req,res){
  res.render('mains/about');
});


router.get('/products/:id',function(req,res,next){
  Product
    .find({category:req.params.id})
    .populate('category')
    .exec(function(err, products){

      if(err) return next(err);

      res.render('mains/category',{products:products});
    });

});

router.get('/product/:id',function(req,res,next){
  Product
    .findOne({_id:req.params.id})
    .populate('category')
    .exec(function(err,product){
      if(err) return next(err);
      res.render('mains/product',{product:product});
    });
});

router.post('/search',function(req,res,next){
  res.redirect(`/search?q=${req.body.q}`);
});

router.get('/search',function(req,res,next){
  if(req.query.q){
    Product.search({
      query_string: {query: req.query.q}
    }, function(err, results){
      if(err) return next(err);
      var data = results.hits.hits.map(function(hit){
        return hit;
      });
      console.log(data);
      res.render('mains/search-results',{
        query: req.query.q,
        data: data
      });
    });
  }
});

module.exports = router;
