var router = require('express').Router();
var User = require('../models/users');
var passport = require('passport');
var passportConfig = require('../config/passport');

router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.get('/profile',function(req,res,next){
  User.findOne({_id:req.user._id}, function(err,user){
    if(user)
      return res.render('accounts/profile', { user:req.user});
    console.log('Cant find user');
    return next(err);
  });
});


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
        req.logIn(user, function(err){
          if(err) return next(err);
          res.redirect('/profile');
        });
    });
  };
});
});

router.get('/update-profile',function(req,res){
  res.render('accounts/update-profile',{success:req.flash('success')});
});

router.post('/update-profile', function(req,res,next){
  User.findOne({_id:req.user._id}, function(err,user){
    if(err) return next(err);
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
