var express = require("express") ; 
var router = express.Router() ; 
var Product = require("../models/product.js") ; 
var Cart = require("../models/cart.js") ; 

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

//route: /products/:pid show for product 
router.get('/products/:id', function(req, res, next) {
    var prod_id = req.params.id ; 
    Product.findById(prod_id, function(err, foundProduct){
        res.render('products/show.ejs', {product: foundProduct});
    })
}) ; 

// /categories/:cid  GET   show all the products of this category
router.get('/categories/:cid',function(req, res, next) {
   var cid = req.params.cid ; 
   Product.find({category: cid}).populate('category').exec(function(err, foundProducts){
       if(err) return next(err) ; 
       res.render('products/index', {products: foundProducts});
   }) ; 
});

//add category
    //show the form 
router.get('/products/new', function(req,res,next){
    res.render('products/new.ejs') ; 
}); 
    //create a product 
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

//add product to cart 
router.post('/product/:pid', function(req, res, next) {
    var pid = req.params.pid ; 
    //1: find out your cart 2: update your cart 3: save your cart 
    Cart.findOne({owner: req.user._id}, function(err, foundCart){
        if(err) return next(err) ; 
        foundCart.items.push({
            item: req.body.product_id , 
            quantity: parseInt(req.body.quantity),
            price : parseFloat(req.body.priceValue)
        }); 
        foundCart.total = (foundCart.total + parseFloat(req.body.priceValue)).toFixed(2) ; 
        foundCart.save(function(err){
            if(err) return next(err) ; 
            res.redirect('/cart') ; 
        })
    }); 
}) ; 

router.get('/cart', function(req, res, next) {
    //1: get your cart.... 
    Cart.findOne({owner:req.user._id}).populate('items.item').exec(function(err, foundCart){
        if(err) return next(err)  ;
        res.render('carts/index.ejs', {cart: foundCart}) ; 
    }); 
}); 

router.post('/remove', function(req, res, next) {
    Cart.findOne({owner: req.user._id}, function(err, foundCart){
        if(err) return next(err)  ;
        //pull the item out of items array 
        foundCart.items.pull(String(req.body.item)) ; 
        //update the total 
        foundCart.total = (parseFloat(foundCart.total) - parseFloat(req.body.itemPrice)).toFixed(2) ;  
        //save and redirect to /cart 
        foundCart.save(function(err){
            if(err) return next(err)  ;
            res.redirect('/cart') ; 
        }); 
    });
}); 

//edit a category
    //show the form
    //update the category

//delete a category


//the search .... 
router.post('/search', function(req,res,next){
    var searchText = req.body.q ; 
    res.redirect('/search?q=' + searchText) ; 
}) ; 

router.get('/search', function(req, res, next) {
    var searchText = req.query.q ; 
    var cleanText = new RegExp(cleanSearchText(searchText), 'gi') ; 
    Product.find({name: cleanText }).populate('category').exec(function(err, foundProducts){
        if (err) {
            return next(err) ; 
        }
        res.render('products/index', {products: foundProducts}) ; 
    }); 
}) ; 






/*
/search/:id   GET    req.params.id
/search?param1=weather GET   req.query.param1 
/search  POST    req.body.q
*/

function cleanSearchText(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}







module.exports = router ; 