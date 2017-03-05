##Authentication

##Intro to Auth
* What tools are we using?
    passportjs: 300+ login strategy
    http://passportjs.org/
    * Passport
    https://www.npmjs.com/package/passport
    * Passport Local: username and password
    https://www.npmjs.com/package/passport-local
    * Passport Local Mongoose: auth,local, with mongoose
    https://www.npmjs.com/package/passport-local-mongoose
* Walk through auth flow
* Discuss sessions
http is stateless: everything is based on request and response. when you send requests, those requests are
one time thing and they dont contain information about history of previous requests and the future requests.
state management:
1: cookie: cookie stored on client file system. suitable for short message
2: session: session stored on server. suitable for shopping cart, shopping history.
sessionid stored on client cookie, send along with request to server, get the session object which contains user info.
* Express-Session
https://www.npmjs.com/package/express-session

##Auth Code Part 1
* Set up folder structure
npm install --save express ejs mongoose body-parser
passport passport-local passport-local-mongoose express-session
* Install needed packages
* Add root route and template
app.get("/") show home.ejs
* Add secret route and template
apps.get("/secret") show secret.ejs

##Auth Code part 2
* use passport, passport-local, and passport-local-mongoose
    passport                = require('passport') ,
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose')
* Create User model in models folder

* Configure passport
1) in user.js: you need to plugin Passport-Local-Mongoose into your User schema:
Additionally Passport-Local Mongoose adds some methods to your Schema.
(https://www.npmjs.com/package/passport-local-mongoose  )
var User = new Schema({xxx});
User.plugin(passportLocalMongoose);
this will give us the following methods ready to be used in app.js:

User.authenticate()
User.serializeUser()
User.deserializeUser()
User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){}})

2) in apps.js, tell express to use passport.
 set up the middleware:
 To use Passport in an Express or Connect-based application,
 configure it with the required passport.initialize() middleware.
 If your application uses persistent login sessions (recommended, but not required),
 passport.session() middleware must also be used:
 (https://github.com/jaredhanson/passport)

app.use(require('express-session')({ secret: 'some text your like to use', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session()) ;

note:1) make sure you put the app.use session first, before passport.initialize() and passport.session()
2)secret is used to encrypt or decrypt password. WE DONT SAVE password in session as plain text EVER!

3) in app.js: tell passport whats the strategy, and how to serialize and deserialize
passport.use(new LocalStrategy(User.authenticate())) ;
passport.serializeUser(User.serializeUser());  serialize the user obj (into text string ) and store in the session
passport.deserializeUser(User.deserializeUser());  deserialize data stored in the session back to be user obj.
http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
normally we should use:
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

note: rather than we define how to do the serialize and deserialize, we use the add-on method provided to User model
through passportLocalMongoose!


#Auth Code part 3--- sign up
* Add Register routes
app.get('/register')
app.post('/register')
* Add Register form
action: /register
method: post

//handling user sign up
app.post('/register', function(req,res){
        User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
            if(err){
                console.log(err);
                return res.render('register.ejs') ;
            } else{
                /*if there is no err, passport.authenticate() will actually let the user in
                and serialize user and store it in session
                normally, once the user sign up, we let the user visit secret page
                 */
                passport.authenticate("local")(req,res,function(){
                    res.redirect('/secret') ;
                }) ;
            }
        });
    }) ;

note: we dont save the password into database.
we take the password and encrypt it into big text and save the text into two properties "salt" and "hash" in database
note: when sign up encrypt:  password + salt -> hash
      when login decrypt: hash + salt -> password


#Auth Code part 4--- login and the use of middleware
* Add Login routes
* Add Login form

//middleware: code run before the callback
app.post('/login', passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}) ,function (req,res) {
});
note: passport auto take the username and password from the request form and compare with hash text stored in database
passport.use(new LocalStrategy(User.authenticate())) ;
here, we dont need to create the LocalStrategy but using the passport-local-mongoose plugin's added to User model

#Auth Code part 5--- logout functionality
* Add Logout routes
req.logout();
when we logout user, we are not changing anything in the database, passport is destroying all user data in the session, so the session could not keep
tracking of the user from request
note: at this point, you still could visit the /secret page. we need to set up a guard

* Add isLoggedIn middleware
when hit the /secret we need to check if the user is login:
if login: show the page
if not login : dont show the page and redirect to the /login page
step 1: define the middleware: middleware always has 3 parameters: req, res, next
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
      return next() ; //keep going, execute secret route's callback
    } else{
        res.redirect("/login") ; //secret route's callback will not be executed
    }
}

note: the next is referring the callback method of the app.get("/secret"") route!

step 2: add the middleware to the /secret route
app.get("/secret", isLoggedIn, function (req,res) { })
so when the request comes in, will run the middleware isLoggedIn before running the callback function!
next here refers to function (req,res) { }