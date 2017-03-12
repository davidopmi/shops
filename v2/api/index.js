var express = require("express") ; 
var router = express.Router() ; 
var User = require("../models/user.js") ; 
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


module.exports = router ; 