// this js is reserved for checkout

//two things: 1) validation 2) get the credit card info and send it to server

$(function(){
    //1: use publishable key 
    Stripe.setPublishableKey('pk_test_b4pqPBsJdbpdUVp9No5Ue1IX');
    
      var opts = {
    lines: 7 // The number of lines to draw
  , length: 32 // The length of each line
  , width: 4 // The line thickness
  , radius: 42 // The radius of the inner circle
  , scale: 1.5 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#000' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 1 // Rounds per second
  , trail: 60 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 2e9 // The z-index (defaults to 2000000000)
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
  }
    
    
    
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
        
        //create spinner 
        var target = $('#holding') ; 
        var spinner = new Spinner(opts).spin() ; 
        target.append(spinner.el) ; 
        
        
        // Submit the form:
        $form.get(0).submit();
      }
}
    
}) ; 
