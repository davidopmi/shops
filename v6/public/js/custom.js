$(function(){
    //dynamic search!!! 
    $('#search_term').on('keyup', function(){
        var search_term = $(this).val() ; 
        $.ajax({
        type:"POST",
        data: {search: search_term},
        url: '/api/search',
        success: function(data){
            $('#searchResults').empty() ; 
            for(var i =0 ; i<data.length ; i++){
                 var htmlText = "" ; 
                htmlText += '<div class="col-sm-6 col-md-4">' ; 
                htmlText += '<div class="thumbnail">' ; 
                htmlText += '<img src="' +data[i].image + ' " alt="could not load image"></img>' ;
                htmlText += '<div class="caption">' ; 
                htmlText += '<h4>the product name is: ' + data[i].name + '</h4>' ;
                htmlText += '<h4>the product price is:'+ data[i].price +'</h4>' ; 
                htmlText += '<h4>the product category is:'+ data[i].category.name +'</h4>' ; 
                htmlText += '</div></div></div>' ; 
                $('#searchResults').append(htmlText) ;
            }
        },
        fail: function(){
            console.log("something is wrong") ; 
        }
    })
    })
    
    //for the plus button:  1) total changed 2) price changed 
    $('#plus').click(function(event){
        //this prevent button's default behavior: which is refresh 
        event.preventDefault() ; 
        //quantity = 1 + 1 = 2 + 1 =3 
        var quantity = parseInt($('#quantity').val()) ; 
        quantity +=1 ;         
        //1: update #quantity value 
        $('#quantity').val(quantity) ; 
        //2: update #total value 
        $('#total').val(quantity) ; 
        $('#total').html(quantity) ;
        //for price 
        var priceValue = parseFloat($('#priceValue').val());
            priceValue += parseFloat($('#productHidden').val()) ;
        $('#priceValue').val(priceValue.toFixed(2)) ;
    }) ; 
    
    //for the minus button 
    $('#minus').click(function(event){
        //this prevent button's default behavior: which is refresh 
        event.preventDefault() ; 
        var quantity = parseInt($('#quantity').val()) ; 
        if (quantity>=1) {
             quantity -=1 ;         
            //1: update #quantity value 
            $('#quantity').val(quantity) ; 
            //2: update #total value 
            $('#total').val(quantity) ; 
            $('#total').html(quantity) ;
            //for price 
            var priceValue = parseFloat($('#priceValue').val());
            priceValue -= parseFloat($('#productHidden').val()) ;
            $('#priceValue').val(priceValue.toFixed(2)) ;
        }
    }) ; 
    
    
}) ; 