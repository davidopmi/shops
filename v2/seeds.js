var mongoose = require("mongoose") ; 
var async = require("async") ; 
var Category = require("./models/category.js") ; 
var Product =require("./models/product.js") ; 
var faker = require("faker") ; 

module.exports = function(){
    var categories = ["Books","Gadgets","Foods"] ; 
    async.waterfall([
        function(callback){
            //1: clear out all the categories
            Category.remove({},function(err){
                if(err) return console.log(err.message) ;
                callback(null) ; 
            }) ; 
        }, 
        function(callback){
            //2: clear out all the products
            Product.remove({}, function(err){
                if(err) {
                    if(err) return console.log(err.message) ;
                    
                } ; 
                callback(null) ; 
            }) ; 
        },function(callback){
            //3: for each category, create 30 different products
            for(var i=0; i<categories.length ; i++){
                Category.create({name: categories[i]}, function(err, newCat){
                    if (err) {
                        if(err) return console.log(err.message) ;
                    }
                    for(var j =0 ; j<30 ; j++){
                        var product = new Product() ; 
                        product.name = faker.commerce.productName(); 
                        product.price = faker.commerce.price() ; 
                        product.image = faker.image.image() ; 
                        product.category = newCat._id ; 
                        product.save(function(err){
                        }); 
                    }
                }) ; 
                
            }
            callback(); 
        }
        ])
}


