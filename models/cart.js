var {Schema} = require('mongoose');
var mongoose = require('mongoose');

var CartSchema = new Schema({
  owner:{type: Schema.Types.ObjectId, ref:'User'},
  total:{type: Number, default:0},
  items:[
    {
      item:{type: Schema.Types.ObjectId, ref:'Product'},
      price:{type: Number, default:0},
      quantity:{type: Number, default: 0}
    }
  ]
});

module.exports = mongoose.model('Cart',CartSchema);
