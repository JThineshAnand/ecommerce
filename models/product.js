var {Schema} = require('mongoose');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var ProductSchema = new Schema({

  category:{type: Schema.Types.ObjectId, ref:'Category'},
  name:String,
  price:Number,
  description:String,
  image:String

});

ProductSchema.plugin(mongoosastic,{
  hosts:['localhost:9200']
});

module.exports = mongoose.model('Product',ProductSchema);
