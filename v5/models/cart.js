var mongoose = require("mongoose") ; 

//create schema
var CartSchema = new mongoose.Schema({
    owner:{ type: mongoose.Schema.Types.ObjectId , 
        ref : "User"},
    total: {type: Number, default:0}, 
    items:[{
        item: {type: mongoose.Schema.Types.ObjectId, 
            ref: "Product"
        }, 
        quantity: {type: Number, default:0}, 
        price: {type: Number, default:0}
    }]
}) ; 

//create model 
var Cart = mongoose.model('Cart', CartSchema) ; 

//export model 
module.exports = Cart ; 