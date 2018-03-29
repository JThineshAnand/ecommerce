var router = require('express').Router();
var Product = require('../models/product');
var User = require('../models/users');
var Cart = require('../models/cart');
var async = require('async');
var stripe = require('stripe')('sk_test_NiBZ0DWQkolmuO3Do23qcJNs');

router.post('/payment', function(req,res,next){
  var stripeToken = req.body.stripeToken;
  var stripeCharges = Math.round(req.body.stripeMoney *100);
  stripe.customers.create(
  { source: stripeToken }).then(function(customer){
    return stripe.charges.create({
      customer: customer.id,
      amount: stripeCharges,
      currency:'usd'
    });
  }).then(function(charge){
    async.waterfall([
      function(callback){
          Cart.findOne({owner:req.user._id},function(err,cart){
            if(err) return next(err);
            console.log(cart);
            callback(null,cart);
          });
      },
      function(cart,callback){
        User.findOne({_id:req.user._id},function(err,user){
          if(err) return next(err);
          for(var i =0;i<cart.items.length;i++){
            user.history.push({
              date:new Date(),
              item: cart.items[i].item,
              quantity: cart.items[i].quantity,
              paid: cart.items[i].price
            });
          }
          console.log(user.history);
            user.save(function(err,user){
              if (err) return next(err);
              callback(null,user);
            });
        });
      },
      function(user){
          Cart.update({owner:user._id},{$set:{ items:[],total:0}},function(err,updated){
            if(updated){
              res.redirect('/profile');
            }
          });
      }
    ])
  });


});

router.get('/cart',function(req,res,next){
  // Cart.findOne({owner:req.user._id}).populate('items.item')
  //   .exec(function(err,foundCart){
  //     if(err) return next(err);
  //     res.render('mains/cart',{foundCart:foundCart});
  //   });

  async.waterfall([
    function(callback){
      Cart.findOne({owner:req.user._id}).populate('items.item').exec(function(err,cart){
          callback(null,cart);
      });

    },
    function(cart){
      //console.log(cart);
      res.render('mains/cart',{foundCart:cart,success:req.flash('success')});
    }
  ]);
});

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
      //console.log(products);
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



router.post('/product/:id',function(req,res,next){
  Cart.findOne({owner:req.user._id}, function(err,cart){
    if(err) return next(err);
    cart.items.push({
      item:req.body.itemID,
      price:parseFloat(req.body.productPrice),
      quantity:parseFloat(req.body.quantity)
    });
    cart.total = (cart.total + parseFloat(req.body.productPrice)).toFixed(2);
    cart.save(function(err,cart){
      if(err) return next(err);
      return res.redirect('/cart');

    });
    //res.render('mains/cart',{foundCart:cart});
  });
});


router.post('/remove',function(req,res,next){
  Cart.findOne({owner:req.user._id}, function(err,cart){
    cart.items.pull(String(req.body.item));
    cart.total = (cart.total - parseFloat(req.body.price)).toFixed(2)
    cart.save(function(err,cart){
      if(err) return next(err);
      req.flash('success','Successfully removed from the cart');
      res.redirect('/cart');
    });
  });
});

module.exports = router;
