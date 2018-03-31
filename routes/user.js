var router = require('express').Router();
var User = require('../models/users');
var passport = require('passport');
var passportConfig = require('../config/passport');
var async = require('async');
var Cart = require('../models/cart');

router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.get('/profile', passportConfig.isAuthenticated, function(req,res,next){
  User.findOne({_id:req.user._id})
    .populate('history.item')
    .then(function(foundUser){
    if(foundUser)
      return res.render('accounts/profile', { foundUser:foundUser});
  });
});

router.get('/auth/facebook',
  passport.authenticate('facebook',{scope:'email'}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/login' }),);

router.get('/login', function(req, res, next) {
  if(req.user) return res.redirect('/profile');
  res.render('accounts/login', {
    message: req.flash('loginMessage')
  });
});

router.post('/login',passport.authenticate('local-login',{
  successRedirect:'/profile',
  failureRedirect: '/login',
  failureFlash:true
}));

router.get('/logout',function(req,res){
  req.logOut();
  res.redirect('/');
});

router.post('/signup', function(req, res, next) {


  async.waterfall([
    function(callback){
      var user = new User();
      user.profile.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.profile.picture = user.gravatar();
      user.profile.address = req.body.address;

      User.findOne({ email: req.body.email }).then((existingUser)=>{
        console.log(existingUser);
        if(existingUser){
        req.flash('errors', 'Account with that email address already exists');
        return res.redirect('/signup');
    }
        else{
          user.save(function(err, user) {
            if (err) return next(err);
          callback(null,user);

        });
      };
    });
    },
    function(user){
      var cart = new Cart();
      cart.owner = user._id;
      cart.save(function(err,cart){
        if(err) return next(err);
        req.logIn(user, function(err){
          if(err) return next(err);
          res.redirect('/profile');
        });
      });
    },

  ]);


});

router.get('/update-profile',function(req,res){
  res.render('accounts/update-profile',{success:req.flash('success'), failure:req.flash('failure')});
});

router.post('/update-profile', function(req,res,next){
  User.findOne({_id:req.user._id}, function(err,user){
    if(err) return next(err);
    if(req.body.name ===''){
      req.flash('failure','Name cannot be Blank');
      return res.redirect('/update-profile');
    }
    user.profile.name = req.body.name;

    user.profile.address = req.body.address;
    user.save(function(err,user){
      if(err) return next(err);
      req.flash('success','Profile Successfully Editted');
      res.redirect('/update-profile');
    });
  });
});

module.exports = router;
