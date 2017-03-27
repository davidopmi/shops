#v4: create cart to host products
note: be familiar with input type="hidden"
      be familiar with jquery to change the client side page: update price
      parseInt(), parseFloat(), String(), number.toFixed(2)

## add Cart Schema
var mongoose = require('mongoose') ;

var CartSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    total:{type: Number, default:0} ,
    items:[{
      item:{type: mongoose.Schema.Types.ObjectId, ref:"Product"},
      quantity:{type:Number, default:1},
      //3 items of pc, each price is $100 so the total price is $300
      price:{type:Number, default:0}  
    }]
});

var Cart = mongoose.model('Cart', CartSchema);

//export the model
module.exports = Cart ;

## modify signup route
note: for every registered user, he should have a cart
after save the user, we should create a cart and assign the current user to be the cart owner, save the cart and then login the user

router.post('/signup', function(req,res,next){
  async.waterfall([
    function(callback){
      var user = new User() ;
      user.profile.name= req.body.name ;
      user.email = req.body.email;
      user.password = req.body.password;
      user.profile.picture = user.gravatar() ;
      User.findOne({email: req.body.email}, function(err, existingUser){
          if(err){
              return next() ;
          }
          if(existingUser){
              req.flash("error", req.body.email+"already exists") ;
              return res.redirect('back') ;
          } else {
              user.save(function(err, user){
                if (err) return next(err) ;
                callback(null, user) ;
              });
          }
      });
    },
    function(user){
      var cart = new Cart() ;
      cart.owner =user_id;
      cart.save(function(err){
        if (err) return next(err) ;
        req.login(user, function(err){
          if (err) return next(err) ;
          res.redirect('/profile');
        });
      }) ;
    }
  ]);
});

## Adding cart quantity middleware: cartLength
var Cart = require('../models/cart') ;
module.exports = function(req,res,next){
  res.locals.cartLength = 0 ;
  if(req.isAuthenticated()){
    Cart.find({owner: req.user_id}, function(err, foundCart){
      if (err) return next(err) ;
      if (foundCart.items != undefined) {
        for (var i = 0; i < foundCart.items.length; i++) {
          res.locals.cartLength +=foundCart.items[i].quantity ;
        }
      }
      next() ;
    })
  }
}

change the header.ejs to use the glyphicon
<li><a href="/cart" class="glyphicon glyphicon-shopping-cart"><span class="badge"><%=cartLength%></span></a></li>

for glyphicon: put it in the span
http://getbootstrap.com/components/#glyphicons-how-to-use

for badge: put it in the span
http://getbootstrap.com/components/#badges


## Adding product to a cart route
1) based on the user_id, find the cart(each owner has its own cart)
2) add the item to cart.items list and also update the total cost for cart
3) remember to save to database
router.post('/product/:pid', function(req,res,next){
  var prod_id = req.params.pid ;
  Cart.findOne({owner:req.user_id}, function(err, cart){
    cart.items.push({
      item: req.body.prod_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.)
    }) ;
    cart.total += parseFloat(req.body.priceValue).toFixed(2) ;
    cart.save(function(err){
      if(err) return next(err) ;
      res.redirect('/cart') ;
    })
  }) ;
}) ;

//some JS built-in function:
1)parseInt: The parseInt() function parses a string and returns an integer.
https://www.w3schools.com/jsref/jsref_parseint.asp
2)parseFloat: The parseFloat() function parses a string and returns a floating point number.
https://www.w3schools.com/jsref/jsref_parsefloat.asp
3).toFixed(2): The toFixed() method converts a number into a string, keeping a specified number of decimals.
https://www.w3schools.com/jsref/jsref_tofixed.asp

## modify views/products/show.ejs page

<form action="#" method="post">
<div class="form-group">
  <input type="hidden" name="product_id" id="product_id" value="<%=product_id%>">
  <!--hidden and value wont change -->
  <input type="hidden" name="productHidden" id="productHidden" value="<%=product.price%>">

  <input type="text" name="item" class="form-control" value="<%=product.name%>" readonly="readonly">
  <!--visible and value will be changed by jquery -->
  <input type="text" name="priceValue" id="priceValue" class="form-control" value="<%=product.price%>" readonly="readonly">
</div>
  <div class="form-group">
    <input type="hidden" name="product_id" id="product_id" value="<%=product_id%>">
    <input type="hidden" name="productHidden" id="productHidden" value="<%=product.price%>">

    <input type="text" name="item" class="form-control" value="<%=product.name%>">
    <input type="text" name="priceValue" class="form-control" value="<%=product.price%>">
  </div>
  <% if(user) { %>
    <button type="sumbit" class="btn btn-primary btn-lg">Add to Cart</button>
  <% } else { %>
    <a href="/signup" class="btn btn-warning btn-lg">Sign up to begin buying</a>
  <%} %>
</form>

bootstrap:
1) button-group: group buttons together
http://getbootstrap.com/components/#btn-groups

2) form-group and form-control
http://getbootstrap.com/css/#forms


## Plus and Minus button functionality using jquery
on the public/js/custom.js, add event handler for the + and - click event:
1) update the quantity's value
2) update the priceValue

$('#minus').click(function(event) {
  event.preventDefault() ;
  var quantity = parseInt($('#quantity').val()) ;
  if (quantity >=1) {
    var priceValue = parseFloat($('#priceValue').val());
    priceValue -= parseFloat($('#productHidden').val()) ;
    quantity -=1 ;

    $('#quantity').val(quantity) ;
    $('#priceValue').val(priceValue.toFixed(2)) ;
    $('#total').html(quantity) ;
  } else{
    return;
  }
});

note: the special treatment for minus: your quantity could not be less than 0!
## Adding Cart index Route
in the routes/product.js : create router.get('/cart')
1) found the cart belong to current user
2) populate the cart's items property. learn how to populate item of array
Cart.findOne({owner: req.user_id}).populate('items.item').exec(function(err,foundCart))
3) create carts/index with views and render it with foundCart

## Adding Cart Page
create views/carts/index.ejs
bootstrap
list-group:
list-group-item:
list-group-item-heading:
list-group-item-text:
http://getbootstrap.com/components/#list-group-custom-content

<div class="list-group">
  <a href="#" class="list-group-item active">
    <h4 class="list-group-item-heading">List group item heading</h4>
    <p class="list-group-item-text">...</p>
  </a>
</div>

note: change the image size of your cart
.product-image{
  width: 100% ;
}

## Adding remove feature to remove product from cart(remove an entire item from cart)
1) change the views/carts/index.ejs to have the remove function(post request through form)
2) in the routes/products.js, add the remove route for cart:
router.post('/remove', function(req,res,next){
  Cart.findOne({owner:req.user_id}, function(err, foundCart){
    //change the id to string
    foundCart.items.pull(String(req.body.item));
    foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2) ;
    foundCart.save(function(err){
      if (err) {
        return next(err) ;
      }
      res.redirect('/cart') ;
    })
  });
});


Note: for edit your cart(add/remove product to your cart's item), you could refer to camp edit and the add product to cart functionality
