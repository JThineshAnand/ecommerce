var {Schema} = require('mongoose');
var mongoose = require('mongoose');

var CategorySchema = new Schema({
  name:{type:String}
});

module.exports = mongoose.model('Category', CategorySchema);
