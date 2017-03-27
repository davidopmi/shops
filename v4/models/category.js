var mongoose = require("mongoose") ; 

//create schema
var CategorySchema = new mongoose.Schema({
    name: {type: String, unique: true, require:true}
}) ; 

//create model 
var Category = mongoose.model('Category', CategorySchema) ; 

//export model 
module.exports = Category ; 