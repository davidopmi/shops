#Common Settings
var express    = require('express') ,
    path       = require('path')    ,
    bodyParser = require('body-parser') ,
    app        = express()  ,
    mongoose   = require('mongoose')  ,
    Camp       = require('./models/camp'),
    Comment    = require('./models/comment') ,
    passport                = require('passport') ,
    LocalStrategy           = require('passport-local'),
    methodOverride  = require('method-override'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    session                 = require('express-session') ,
    flash      = require('connect-flash') ,
    User        = require('./models/user') ,
    seedDB     = require('./seeds')  ,
    morgan      = require('morgan')
    ;

//====require routes ====
var commentRoutes = require('./routes/comments') ,
    campRoutes    = require('./routes/camps'),
    indexRoutes    = require('./routes/index') ;

//call the function to clear the database
// seedDB() ;

//settings
app.set('view engine', 'ejs') ;
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(bodyParser.urlencoded({extended: true}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method')) ;
// use connect-flash
app.use(flash()) ;
//=== use morgan
app.use(morgan("dev")) ;

//middleware for passport: note to put app.use(require('express-session')) first!!!
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()) ;

// tell passport whats the strategy, and how to serialize and deserialize
passport.use(new LocalStrategy(User.authenticate())) ;
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===== middleware to define local variables ====
app.use(function(req,res,next){
    //capture req.user to local variable of res. so we could use this var in all the ejs files
    res.locals.currentUser = req.user ;
    //set up flash message
     res.locals.error = req.flash("error") ;
     res.locals.success = req.flash("success") ;
    //middleware hijack the route's handler, so if you don't call the next(), the program will stop here
    next() ;
}) ;

//======tell app to use those 3 routes files, make sure its after the res.locals.current setting
app.use('/',indexRoutes) ;
app.use('/camps', campRoutes) ;
app.use('/camps/:id/comments',commentRoutes) ;


//connect to local database
// mongoose.connect("mongodb://localhost/camp_v16") ;
var url = process.env.DATABASEURL || "mongodb://localhost/camp_v16" ;
mongoose.connect(url) ;
// mongoose.connect(process.env.DATABASEURL) ;
console.log(process.env.DATABASEURL) ;
//connect to mlab database
//mongoose.connect("mongodb://david:123@ds157278.mlab.com:57278/camps") ;


//start up server
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
    console.log("camps is up!") ;
});
