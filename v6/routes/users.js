var express = require("express") ; 
var router = express.Router() ; 
var User = require("../models/user.js") ; 
var passport = require('passport') ; 
var async = require("async") ;
var Cart = require("../models/cart.js") ;
var protection = require("../middleware/protection.js") ;

//new route:   /signup
router.get('/signup', function(req,res,next){
    res.render('users/signup.ejs'); 
}); 

//0) check to see if the user already exist in database!!! 1) save its info into database 2) you login this user! using passportjs
router.post('/signup', function(req, res, next) {
    async.waterfall([
        function(callback){
            var newUser = new User() ; 
            newUser.email = req.body.email ; 
            newUser.password = req.body.password ; 
            newUser.profile.name = req.body.name ; 
            newUser.profile.picture = req.body.picture ; 
            User.findOne({email: req.body.email}, function(err, existUser) {
                if (err) return next(err) ; 
                if(existUser){
                    res.redirect("back") ; 
                } else{
                    newUser.save(next) ; 
                    callback(null, newUser); 
                }
            })
        },
        function(newUser){
            //create a cart 
            var cart = new Cart() ; 
            cart.owner = newUser._id  ; 
            cart.save(function(err){
                if (err) return next(err) ; 
                //login user
                req.login(newUser, function(err){
                    if(err) return res.redirect('/login'); 
                    res.redirect('/'); 
                })
            }); 
        }]) ; 
}); 

//login 
    //get: show the form  
router.get('/login', function(req,res,next){
    res.render('users/login.ejs') ; 
})
    //post: submit
router.post('/login',passport.authenticate('local', {
    successRedirect: "/", 
    failureRedirect:"/login" , 
    failureFlash: true 
}), function(req,res,next){ } ) ; 

//logout
router.get('/logout', function(req, res, next) {
    req.logOut() ; 
    //redirect to home page 
    res.redirect('/') ; 
}) ; 

//profile: use middleware to protect this route from not login user... 
router.get('/profile', protection.isLogin  , function(req, res, next) {
    // populate history.item 
    User.findOne({_id: req.user._id}).populate("history.item").exec(function(err, foundUser){
        if(err) return next(err) ; 
        res.render('users/profile.ejs', {user: foundUser}) ;
    })
    
    
    // console.log("we are at /profile") ;
    // //find the user, get the data, and then render to profile.ejs
    //     User.findOne({_id: req.user._id}, function(err, foundUser){
    //     if(err) return next(err) ; 
    //     res.render('users/profile.ejs', {user: foundUser}) ;
    // })  ; 
}); 


module.exports = router ; 