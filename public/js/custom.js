
  $(function(){
    $('#searchid').keyup(function(){
      var searchterm = $(this).val();
      $.ajax({
        method:'POST',
        url:'/api/search',
        data:{
          searchterm
        },
        dataType:'json',
        success: function(products){
          console.log(products);
          $('#results').empty();
          var html='';

          for (var i = 0; i < products.length; i++) {
         var html = "";
         html += '<div class="col-md-4">';
         html += '<a href="/product/' + products[i]._id + '">';
         html += '<div class="thumbnail">';
         html += '<img src="' +  products[i].image + '">';
         html += '<div class="caption">';
         html += '<h3>' + products[i].name  + '</h3>';
         html += '<p>$' +  products[i].price  + '</p>';
         html += '</div></div></a></div>';

         $('#results').append(html);
       }
     },
        error: function(err){
          console.log(err);
        }
      });
    });
  });



  $(document).on('click','#add',function(){
    var quantity = parseInt($('#quantity').val());
    var price = parseInt($('#priceHidden').val());
    var quantity = quantity +1;
    var totalprice = parseInt($('#totalPrice').val());
    totalprice = totalprice + price;
    $('#quantity').val(quantity);
    $('#total').html(quantity);
    $('#totalPrice').val(totalprice);
  });

  $(document).on('click','#minus',function(){
    var quantity = parseInt($('#quantity').val());
    if(quantity !=1){
    var price = parseInt($('#priceHidden').val());
    var quantity = quantity  - 1;
    var totalprice = parseInt($('#totalPrice').val());
    totalprice = totalprice - price;
    $('#quantity').val(quantity);
    $('#total').html(quantity);
    $('#totalPrice').val(totalprice);}
  });
