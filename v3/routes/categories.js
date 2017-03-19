var express = require("express") ; 
var router = express.Router() ; 
var Category = require("../models/category.js") ; 

//add category
    //show the form 
router.get('/categories/new', function(req,res,next){
    res.render('categories/new.ejs') ; 
}); 
    //create 
router.post('/categories', function(req,res,next){
    //create a new category, get the category name from req, save it to database 
    var newCat = new Category() ; 
    newCat.name = req.body.name ; 
    newCat.save(function(err){
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