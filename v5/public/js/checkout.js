// this js is reserved for checkout

//two things: 1) validation 2) get the credit card info and send it to server

$(function(){
    //1: use publishable key 
    Stripe.setPublishableKey('pk_test_b4pqPBsJdbpdUVp9No5Ue1IX');
    
    //2: Collecting card details ONLY happens when click the pay button(sumbmit)
    $('#payment-form').submit(function(event){
        var $form = $(this) ; 
        //find the button and disable it... 
        $form.find('button').prop('disable', true) ; 
        
        Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val()
        }, stripeResponseHandler);
        return false ; 
    }) ; 
    
    function stripeResponseHandler(status, response) {
      // Grab the form:
      var $form = $('#payment-form');
      if (response.error) { // Problem!
        // Show the errors on the form
        $('#payment-errors').text(response.error.message);
        $('#payment-errors').removeClass('hidden') ; 
        $form.find('button').prop('disabled', false); // Re-enable submission button
        
      } else { // Token was created!
        // Get the token ID:
        var token = response.id;
    
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        
        // Submit the form:
        $form.get(0).submit();
      }
}
    
}) ; 
