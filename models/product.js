var {Schema} = require('mongoose');
var mongoose = require('mongoose');

var ProductSchema = new Schema({

  category:{type: Schema.Types.ObjectId, ref:'Category'},
  name:String,
  price:Number,
  description:String
  image:String

});

module.exports = mongoose.model('Product',ProductSchema);
