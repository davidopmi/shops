var express = require("express") ; 
var router = express.Router() ; 
var User = require("../models/user.js") ; 
var Product =require("../models/product.js") ;

// /api/test
router.get('/test', function(req,res){
    res.json("api testing works") ;     
}); 

router.post('/create-user', function(req,res,next){
    var newUser = new User() ; 
    newUser.email = req.body.email ; 
    newUser.password = req.body.password ; 
    newUser.profile.name = req.body.name ; 
    newUser.profile.picture = req.body.picture ; 
    newUser.address = req.body.address ; 
    newUser.save(function(err){
        if (err) {
            return next(err) ; 
        }
        res.json(newUser) ; 
    })
}) ; 

//search API: /api/search  POST 
router.post('/search', function(req,res,next){
    if(req.body.search){
        var searchText = req.body.search ; 
        var searchClean = new RegExp(cleanSearchText(searchText), 'gi') ; 
        Product.find({name: searchClean}).populate('category').exec(function(err, foundProducts){
            if (err) {
                return next(err) ; 
            }
            res.json(foundProducts) ; 
        }); 
    }
}) ; 

function cleanSearchText(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}




module.exports = router ; 