var mongoose = require("mongoose") ; 
var bcrypt = require("bcrypt-nodejs") ; 

//create schema
var UserSchema = new mongoose.Schema({
    email: {type: String, unique: true, require:true},
    password: String, 
    profile:{
        name: {type: String, default:""} ,
        picture: {type: String, default:""} 
    }, 
    history: [{
        paid: {type : Number, default: 0}, 
        item: {type: mongoose.Schema.Types.ObjectId, 
            ref: "Product"
        }
    }]
}) ; 
// bcrypt to do 3 things!!! 
//1: generate a salt(key)   done 
//2: use the salt to hash our password  done
//3: use the salt to compare with hashed password to see if matches
var SALT_FACTOR = 10 ; 
UserSchema.pre("save", function(done){
    //is the password changed???
    var user = this ; 
    if(!user.isModified("password")){
        return done() ;
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if (err) {
            return done(err) ; 
        } 
        bcrypt.hash(user.password,salt, null, function(err, hashedPassword){
        if (err) {
            return done(err) ; 
        } 
        user.password = hashedPassword ; 
        done() ; 
        })
    }); 
}); 

UserSchema.methods.comparePassword = function(guess, done){
    bcrypt.compare(guess, this.password, function(err, isMatch){
        done(err, isMatch) ; 
    })
}; 

//create model 
var User = mongoose.model('User', UserSchema) ; 

//export model 
module.exports = User ; 