
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
