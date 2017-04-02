# v5: the stripe payment

#payment 1:
1: sign up at: https://stripe.com/
once signed in, you could go to API and find your keys.
for teaching purpose, we only use
Test Secret Key: for server
Test Publishable Key: for client
2: install stripe package:
https://www.npmjs.com/package/stripe
npm install --save stripe

3: refer to the stripe quickstart
https://stripe.com/docs/quickstart

4: write the strip logic:
step 0: in app.js use stripe package:
var stripe = require('stripe')('sk_test_hfu7rNHgh7SGrGKmCxh0sadm') ;

in products.js write the following:

router.post('/payment', function(req,res,next){
  //1: get token from client side form
  var stripeToken = req.body.stripeToken ;
  // stripe amount is in cents 
  var currentCharges = Math.round(req.body.stripeMoney * 100) ;
  //2: create a customer
  stripe.customers.create({
    source: stripeToken   //3: once customer is created, prepare charge details
  }).then(function(customer){
    return stripe.charges.create({
      amount: currentCharges,
      currency: "usd",
      customer: customer.id
    });  //4: when charge details are ready, start to charge
  }).then(function(charge){

  });
});

#payment 2: create the client side payment form
open views/carts/index.ejs and update the view to have payment form
bootstrap modal: use the live demo
http://getbootstrap.com/javascript/#modals-examples

in the modal body section, insert a bootstrap snippet code
http://bootsnipp.com/snippets/featured/credit-card-payment-with-stripe

copy between
 <!-- CREDIT CARD FORM STARTS HERE -->
 <!-- CREDIT CARD FORM ENDS HERE -->

then create the public/css/checkout.css and copy the css there
then add the font-awesome in header.ejs
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

#payment 3: work with client side jquery
refer to the stripe's api  
https://stripe.com/docs/stripe.js

use stripe sdk to do the form validation(use jquery to get the form value, send to the stripe service to validate)
1: Including Stripe.js
<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
2: create the public/js/checkout.js

3: Setting your publishable key:
when stripe validate credit card data, if the data is valid, it will give us back a token. This token will hold the credit card data encrypted with this publishable key.
so when we send this token to server, our server will use the secrete key to decrypt the token to get the useful data from your credit card and make the actual charge.

4: Collecting card details
card.createToken:Converts sensitive card data to a single-use token that you can safely pass to your server to charge the user.
  Stripe.card.createToken({
    number: $('.card-number').val(),
    cvc: $('.card-cvc').val(),
    exp_month: $('.card-expiry-month').val(),
    exp_year: $('.card-expiry-year').val()
  }, stripeResponseHandler);
note: the card-number, cvc, exp_month and exp_year are required. you could combine with more info(like address) if needed.


#modify payment route
after user made payment, we want to:
1: push all the products user just bought to history schema
update UserSchema:
history:[{
  paid: {type: Number, default: 0 },
  item :{type: mongoose.Schema.Types.ObjectId , ref:"Product"}
}]
2: update the cart's items to be empty and total = 0
use mongoose update:
http://mongoosejs.com/docs/2.7.x/docs/updating-documents.html
note the difference:
var query = { name: 'borne' };
Model.update(query, { name: 'jason borne' }, options, callback)

// is sent as

Model.update(query, { $set: { name: 'jason borne' }}, options, callback)
This helps prevent accidentally overwriting all of your document(s) with { name: 'jason borne' }.
