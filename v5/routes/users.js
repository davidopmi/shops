var express = require("express") ; 
var router = express.Router() ; 
var User = require("../models/user.js") ; 
var passport = require('passport') ; 
var async = require("async") ;
var Cart = require("../models/cart.js") ;

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

module.exports = router ; 