#v1 setting up project skeleton, passport-local authorization, profile, gravatar, edit profile

* npm init
* npm install --save express ejs mongoose body-parser
* create models, public, views, views/partials folder
* install and use the nodemon
    npm install --g nodemon
    nodemon app.js
so whenever you made changes in app.js, you dont need to restart the server. nodemon will monitor every changes in app.js
 and if there is a change, it will restart it for you.
* create the start script in package.json(this is required for heroku)
* install the morgan for logging purpose( could log to the server STDOUT or in a file)
https://www.npmjs.com/package/morgan
npm install --save morgan
morgan      = require('morgan')
app.use(morgan('dev'))  ;

* create project structure: models, routes, views, views/partials, views/main, public, public/css, public/js, middleware,

* create models/user.js and create the schema
    var mongoose = require('mongoose') ;
    var userSchema = new mongoose.Schema({
        username:{type: String,unique: true, lowercase:true},
        email: {type: String,unique: true, lowercase:true},
        password: {type: String,  lowercase:true},
        profile: {
            name: {type: String, default: ''},
            picture: {type: String, default: ''}
        },
        address: String,
        history:[{date: Date, paid: {type: Number, default: 0 }
        //item :{type: mongoose.Schema.Types.ObjectId , ref:""} ,
        }]
    });
    var User = mongoose.model('User', userSchema);

    //export the model
    module.exports = User ;

* use postman to test user schema
we could use postman to test our routes without creating the page
    1) make sure you use body-parser(need it to receive post message)
    body-parser will take the body of your request to parse it into a format whatever your server want to receive in POST request or PUT request
    formats include: json, urlencoded text, or raw data; but it could not handle multipart form data, like upload image, videos, etc
    app.use(bodyParser.json()) ;   //bodyParser.text() or bodyParser.raw()
    app.use(bodyParser.urlencoded({extended: true}));  // make express to be able to handle application/x-www-form-urlencoded
    reference:  application/x-www-form-urlencoded or multipart/form-data?
    http://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
    short answer:  application/x-www-form-urlencoded: used for typical form data, uploaded in one query string:  MyVariableOne=ValueOne&MyVariableTwo=ValueTwo
                   multipart/form-data  used for upload images and videos
                   
    for normal form data: header: content-type:  application/x-www-form-urlencoded   (set it in postman)
    for multi form data: header: content-type:  multipart/form-data    (dont set it in postman)
                   
   https://www.quora.com/What-exactly-does-body-parser-do-with-express-js-and-why-do-I-need-it
   http://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
   "
   If extended is false, you can not post "nested object"
   person[name] = 'cw'
   // Nested Object = { person: { name: cw } }
   If extended is true, you can do whatever way that you like.
   "
    2) open postman, localhost:3000/create-user POST, and in the body, select x-www-form-urlencoded, and put the key-value pair
    note, dont select form-data, since in app.js we specify we want express to handle the x-www-form-urlencoded. form-data will not be saved
    3) in app.js, set up the create-user route:
    app.post('/create-user', function(req,res, next){
        var newUser = new User() ;
        newUser.profile.name = req.body.name ;
        newUser.email = req.body.email ;
        User.register(newUser, req.body.password, function(err, user){
            if(err){
                console.log(err) ; return next() ;
            } else{
                passport.authenticate("local")(req,res,function(){
                    res.json("successfully created a new user") ;
                }) ;
            }
        });
    }) ;
    4) start your server and test it in postman: send the request and check the database to make sure it works.

* passport local strategy refer to "introAuthentication" project note
npm install --save passport passport-local passport-local-mongoose express-session
* create the models/user.js model with 'passport-local-mongoose'
* refer to the camps project's routes/user.js, copy: 1) app.js settings for passport-local 2) routes/user.js for authentication
 we will clean routes later.

 * create the views/main folder and two files: about.ejs and home.ejs
  note: refer to camps project, copy the header.ejs and footer.ejs. remember: using existing code is aways better than start from scratch

 * create the public/partials folder and two files: header.ejs and footer.ejs
   copy codes from camps project. remember, copy from your old code is always better than start from scratch!

 * bring in bootstrap into header.ejs and set up the nav.
 (go to bootstrap, get start, pick up one example, right click to check its source)
 
 * create the router folder and two files: main.js(main biz logic) and user.js(handle root, and authentication)
 also use the express.Router and expose it for app.js to use

 * in app.js, set up the router

 

## sign up, login, logout === refer to middleAuthentication project
* create the register.ejs(copy from camps project register.ejs)
Question: 
Center a column using Twitter Bootstrap 3
http://stackoverflow.com/questions/18153234/center-a-column-using-twitter-bootstrap-3
The first approach uses Bootstrap's own offset classes so it requires no change in markup and no extra CSS. 
The key is to set an offset equal to half of the remaining size of the row. So for example, a column of size 2 would be centered by adding an offset of 5, that's (12-2)/2.

In markup this would look like:

<div class="row">
    <div class="col-md-2 col-md-offset-5"></div>
</div>

* set up the currentUser and make changes to the header's nav. to display login/register/logout


* use the connect-flash:
use bootstrap dismissible alerts:
http://getbootstrap.com/components/#alerts-dismissible
the reason flash is depended on cookie and session is you want to store the flash message in session so that it could be 
used in another request route. 
    
    
* use mongoStore to store session in database: you will store session collection in database, instead of memory
in app.js: 
var MongoStore = require('connect-mongo/es5')(session);
app.use(session({
    secret:"secret dog", resave:true, saveUninitialized:true ,store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoReconnect: true,
        ttl: 60*60  //60 mins. 14 days. default
    })})) ;
    
#profile page
create accounts/profile.ejs: after login, should redirect to profile.ejs 

# work on our nav bar in header.ejs 
 refer to bootstrap navbar component at: 
 http://getbootstrap.com/components/#navbar
 
note: we need the jquery and then the bootstrap js file to make the drop down work: put those in the header.ejs   
<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    <ul class="nav navbar-nav navbar-right">
        <% if (! currentUser){%>
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Signup / Login <span class="caret"></span></a>
            <ul class="dropdown-menu">
                <li><a href="/signup">Sign up!</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </li>
        <%} else {%>
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><%= currentUser.profile.name%> <span class="caret"></span></a>
            <ul class="dropdown-menu">
                <li><a href="/profile">Profile</a></li>
                <li><a href="/signup">Logout</a></li>
            </ul>
        </li>
        <% } %>
    </ul>
</div>


# work on the home.ejs 
Special Characters in HTML: 
http://www.degraeve.com/reference/specialcharacters.php
right angle quote: »

# put js files/settings in a separate file
cut the <script> tags from header.ejs and move it to javascriptOnly.ejs 
and then include it from header.ejs:
<% include javascriptOnly.ejs %>


# polish the profile.ejs: use crypto and gravatar to hash each user email to each user has unique profile image  
1)in models/user.js add the following method:
userSchema.methods.gravatar = function (size) {
   if (!this.size) {
       size = 200 ;
   }
   if (!this.email){ return 'https://gravatar.com/avatar/?s=' + size + "&d=retro" ;}
   var md5 = crypto.createHash('md5').update(this.email).digest('hex') ;
   return 'https://gravatar.com/avatar/?' + md5 + "?s=" + size + "&d=retro" ;

};
2) change the profile.ejs:
<div class="container">
    <div class="row">
        <div class="col-sm-6 col-md-4">
            <img class="img-circle img-responsive img-center" src="<%= user.profile.picture %>" alt="">
            <br>
            <p>Name: <%= user.profile.name%></p>
            <p>Email: <%= user.email%></p>
            <p>Address: <%= user.address%></p>
        </div>
    </div>
</div>
3) go to the routers/user.js, in the signup route: 

4) then delete all users in database: 
db.dropDatabase() 

crypto: this is a build-in package of nodejs
https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
gravatar: https://en.gravatar.com/site/implement/hash/
"All URLs on Gravatar are based on the use of the hashed value of an email address. Images and profiles are both accessed via the hash of an email, 
and it is considered the primary way of identifying an identity within the system."
step 1: create the md5 hash of your email(we use crypto to hash the email)
step 2: Gravatar image requests: https://en.gravatar.com/site/implement/images/ 
The most basic image request URL looks like this:
https://www.gravatar.com/avatar/HASH
couple of options:
s: image size
d: different kinds of image


# edit profile feature
1) create the accounts/edit-profile.ejs
copy the login.ejs, remember to put the value = "<%=%>" attribute there
2) router.get('/edit-profile',function(req,res,next){
       var userId = req.user._id ;
       User.findById(userId, function(err, foundUser){
           if(err){
               return next(err) ;
           } else{
               res.render('accounts/edit-profile.ejs', {user: foundUser}) ;
           }
       });
   
   }) ;
   
   router.post('/edit-profile',function(req,res,next){
       var userId = req.user._id ;
       User.findByIdAndUpdate(userId, req.body.user , function(err, updatedUser){
           if(err){
               return next(err) ;
           } else{
               req.flash("message", "Successfully Edited your profile") ;
               res.redirect('/profile') ;
           }
       });
   }) ;