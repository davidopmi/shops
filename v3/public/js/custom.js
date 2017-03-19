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
    
    
    
}) ; 