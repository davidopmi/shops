# v6: create profile route and history page

#1 : add a spinner
use spin.js for the payment process
http://spin.js.org/
copy the file content of spin.min.js to a newly created file, make sure reference this file before checkout.js
1: in the checkout.js, copy the option, create the spinner before the form is submitted
var target = $('#loading') ;
var spinner = new Spinner(opts).spin();
target.append(spinner.el) ;
2: in the carts/index.ejs, create a hosting tag for the spinner

<!-- section for spinner -->
<div class="row">
  <div class="col-lg-6 col-md-offset-3">
    <div class="text-center" id="loading">

    </div>
  </div>
</div>


#2: add history data to profile page
1: create views/accounts/index.ejs

<div class="container">
    <div class="row">
        <div class="col-sm-6 col-md-4">
            <img class="img-circle img-responsive img-center" src="<%= user.profile.picture %>" alt="">
            <br>
            <p>Name: <%= user.profile.name%></p>
            <p>Email: <%= user.email%></p>
            <p><a class="btn btn-primary btn-lg" href="/edit-profile" role="button">Edit &raquo;</a></p>
        </div>
    </div>
</div>

note:
1: bootstrap image related
http://getbootstrap.com/css/#images-shapes

  Responsive images: scales nicely to the parent element
  class="img-responsive"
  To center images which use the .img-responsive class, use .center-block:
  class="center-block"
  Image shapes
   class="img-circle"

   to move text to center:
class="text-center"
http://getbootstrap.com/css/#type-alignment

2: create the router.get('/profile') in the user.js
router.get('/profile',function(req,res,next){
    var userId = req.user_id ;
    User.findById(userId, function(err, foundUser){
        if(err){
            return next(err) ;
        }
        res.render('accounts/index.ejs', {user: foundUser}) ;
    }) ;
}) ;

3: create isAuthenticated middleware: middleware/index.js
var middlewareObj = {} ;
middlewareObj.isLogin = function(req,res,next){
    if(req.isAuthenticated()){
        return next() ;
    } else{
        res.redirect("/login") ;
    }
} ;
module.exports = middlewareObj ;
4: in the routes/user.js, import this middlewareObj and use the isLogin middleware

5: change the route to populate user's history.item property. current hisotry.item only stores productID.
so to show detailed/meaningful product info, you would have to populate this to refer to the product

6: update the views/accounts/index.ejs to have shopping history
bootstrap table related:
http://getbootstrap.com/css/#tables
1: Striped rows: Use .table-striped to add zebra-striping to any table row within the <tbody>.

<div class="col-md-6">
  <h2 class="text-center">History</h2>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Items' Name</th>
        <th>Paid: </th>
      </tr>
    </thead>
    <tbody>
      <%for(var i= 0; i<user.history.length ; i++) {%>
        <tr>
          <td><%=user.history[i].item.name %></td>
          <td><%=user.history[i].paid %></td>
        </tr>
      <% } %>
    </tbody>
  </table>
</div>
