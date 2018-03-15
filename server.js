var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/users')
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');



mongoose.connect('mongodb://cja:cja@ds117878.mlab.com:17878/ecommerce',function(err){
  if(err) throw err;
  else console.log('Database Connected');
})

var app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.engine('ejs',engine);
app.set('view engine','ejs');

app.get('/',function(req,res){
  res.render('mains/home');
});

app.get('/about',function(req,res){
  res.render('mains/about');
});

app.post('/create-user',function(req,res,next){

  var user = new User();
  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save(function(err){
    if(err)
    return next(err);
    res.json("New User created");
  });

});





var port = process.env.PORT || 3000;
app.listen(port,function(err){
  if(err)
  throw err;
  else
  console.log(`Server is running on ${port}`)
});
