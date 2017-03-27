var mongoose = require("mongoose") ; 

//create schema
var ProductSchema = new mongoose.Schema({
    name: {type: String, unique: true, require:true},
    price: Number, 
    image: String, 
    category: {
        type: mongoose.Schema.Types.ObjectId , 
        ref : "Category"
    }
}) ; 

//create model 
var Product = mongoose.model('Product', ProductSchema) ; 

//export model 
module.exports = Product ; 