var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/users')

mongoose.connect('mongodb://cja:cja@ds117878.mlab.com:17878/ecommerce',function(err){
  if(err) throw err;
  else console.log('Database Connected');
})

var app = express();
app.use(morgan('dev'));

var port = process.env.PORT || 3000;
app.listen(port,function(err){
  if(err)
  throw err;
  else
  console.log(`Server is running on ${port}`)
});


app.get('/',(req,res)=>{
  res.json('Hi welcome to home Page');
});

app.get('/about',(req,res)=>{
  res.json('Hi this is about Page');
});
