
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
Stripe.setPublishableKey('pk_test_E2czI7XaqiZDIzlSqvYJYS5p');

  function stripeResponseHandler(status, response) {

  // Grab the form:
  var $form = $('#payment-form');

  if (response.error) { // Problem!

    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();

  }
}
$('#payment-form').submit(function(event) {
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    return false;
  });


});
