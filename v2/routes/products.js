var express = require("express") ; 
var router = express.Router() ; 
var Product = require("../models/product.js") ; 

//index 
router.get('/products', function(req, res, next) {
    Product.find({}, function(err, foundProducts){
        if (err) {
            return next(err) ; 
        } 
        res.render('products/index.ejs', {
            products: foundProducts
        }); 
    }) ; 
}) ; 



//add category
    //show the form 
router.get('/products/new', function(req,res,next){
    res.render('products/new.ejs') ; 
}); 
    //create 
router.post('/products', function(req,res,next){
    //create a new category, get the category name from req, save it to database 
    var newProduct = new Product() ; 
    newProduct.name = req.body.name ; 
    newProduct.price = req.body.price ; 
    newProduct.image = req.body.image ; 
    //save the category: need to do the following things: 
    newProduct.category = req.body.category ; 
    newProduct.save(function(err){
        if (err) {
            return next(err) ; 
        }
        res.redirect('/'); 
    })
}) ; 

//edit a category
    //show the form
    //update the category

//delete a category




module.exports = router ; 