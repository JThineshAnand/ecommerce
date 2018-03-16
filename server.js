var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/users')
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');


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
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:"Anand"
}));

app.use(flash());
app.use(mainRoutes);
app.use(userRoutes);

var port = process.env.PORT || 8080;
app.listen(port,function(err){
  if(err)
  throw err;
  else
  console.log(`Server is running on ${port}`)
});
