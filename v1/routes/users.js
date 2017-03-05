var express = require("express") ; 
var router = express.Router() ; 
var User = require("../models/user.js") ; 

//new route:   /signup
router.get('/signup', function(req,res,next){
    res.render('users/new.ejs'); 
}); 

router.post('/signup',function(req,res,next){
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
}); 

module.exports = router ; 