var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var Cart = require('../models/cart');
var secret = require('./config');

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

passport.use(new FacebookStrategy(secret.facebook,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({facebook:profile.id},function(err,user){
      if(err)  return done(err);
      if(user){
        return done(null,user);
      }else{
          var newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebook = profile.id;
          newUser.tokens.push({kind:'facebook',token:token});
          newUser.profile.name = profile.displayName;
          newUser.profile.picture = 'https://graph.facebook.com/' +profile.id+ '/picture/?type=large';
          newUser.save(function(err,savedUser){
            if(err) return done(err);
            if(savedUser){
              var cart = new Cart();
              cart.owner = savedUser._id;
              cart.save(function(err){
                if(err) return done(err);
                done(null,savedUser);
              });
            }
          });
      }
    });
  }
));


exports.isAuthenticated = function(req,res,next){
  if(req.user)
    return next();
  return res.redirect('/login');
}
