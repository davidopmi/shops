var protection = {}  ; 
//check user login or not
protection.isLogin = function(req,res,next){
    console.log("we are at protection") ;
    if(req.isAuthenticated()){
        return next() ; 
    } else{
        res.redirect('/login') ; 
    }
}


module.exports = protection ; 