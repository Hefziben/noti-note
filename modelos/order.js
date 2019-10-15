mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const orderSchema = new Schema({
number:{type:String}

});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;