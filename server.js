var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/users')
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var secret = require('./config/config');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var Category = require('./models/category');

mongoose.connect(secret.database).then(()=>{
  console.log('DB connected');
},err =>{
  console.log('Cannot connect to DB')
});


var app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:secret.secretKey,
  store: new MongoStore({url:secret.database, autoReconnect:true})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

app.use(function(req,res,next){
  Category.find({},function(err,categories){
    if(err) return next(err);
    res.locals.categories = categories;
    next();
  });

});


app.use(flash());
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);

var port = process.env.PORT || secret.port;
app.listen(port,function(err){
  if(err)
    throw err;
  else
    console.log(`Server is running on ${port}`)
});
