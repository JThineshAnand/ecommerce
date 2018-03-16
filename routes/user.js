var router = require('express').Router();
var User = require('../models/users');


router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res, next) {
  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;


  User.findOne({ email: req.body.email }).then((existingUser)=>{
    console.log(existingUser);
    if(existingUser){
    req.flash('errors', 'Account with that email address already exists');
    return res.redirect('/signup');
}
    else{
      user.save(function(err, user) {
        if (err) return next(err);
          res.redirect('/');
    });
  };
});
});

module.exports = router;
