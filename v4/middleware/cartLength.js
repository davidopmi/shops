var Cart = require("../models/cart.js") ; 

module.exports = function(req,res,next){
    res.locals.cartLength = 0 ; 
    if (req.user) {
        Cart.findOne({owner: req.user._id},function(err, foundCart){
            if(err) return next(err); 
            if (foundCart.items!=undefined) {
                for(var i = 0; i < foundCart.items.length ; i++){
                    res.locals.cartLength += foundCart.items[i].quantity ; 
                }
            }
            return next() ;
        }); 
    }
    else{
        return next();
    }
}