var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
passport.serializeUser(function(user,done){
  done(null,user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id,function(err, user){
    done(err,user);
  });
});


passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passportField: 'password',
  passReqToCallback :true
},function(req,email,password,done){
  User.findOne({email:email},function(err,user){
    if (err)
      return done(err);
    if(!user)
      return done(null,false,req.flash('loginMessage','Email does not exist'));
    if(!user.comparePassword(password))
      return done(null, false, req.flash('loginMessage','Invalid Password'));
    return done(null,user);
  });
}));


exports.isAuthenticated = function(req,res,next){
  if(req.user.isAuthenticated())
    return next();
  return res.redirect('/login');
}
