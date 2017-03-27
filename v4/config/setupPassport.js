//here we need to config/tell passport how to do the authentication!!!!
var passport = require("passport") ; 
var LocalStrategy = require("passport-local").Strategy ; 
var User = require("../models/user.js") ; 
module.exports= function(){
    //serialize: convert user obj into a string  
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    //deserialize: convert string into a user obj
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
           done(err, user) ;  
        });
    });

    //config 
    passport.use("local", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function(req,email,password, done ){
        User.findOne({email: email}, function(err,foundUser){
            if (err) {
                return done(err) ; 
            } if(!foundUser){
                return done(null, false, req.flash("error","user does not exist!")); 
            }if(foundUser.comparePassword(password, function(err, isMatch){
                if (err) {
                    return done(err);
                } if(!isMatch){
                    done(null, false,req.flash("error","password does not match!")); 
                } 
                done(null, foundUser) ; 
            }));
        });
    }));
}