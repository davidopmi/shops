var express    = require('express') ,
    path       = require('path')    ,
    bodyParser = require('body-parser') ,
    cookieParser = require("cookie-parser") , 
    session     = require("express-session"), 
    MongoStore = require('connect-mongo/es5')(session),
    passport    = require("passport"), 
    setupPassport = require("./config/setupPassport"), 
    mongoose   = require('mongoose')  ,
    morgan     = require("morgan") , 
    //models 
    Category  = require("./models/category.js") , 
    app        = express()
    ;

//connect to database 
mongoose.connect("mongodb://david:123@ds119380.mlab.com:19380/shops") ;

//settings
app.use(morgan("dev")); 
app.set('view engine', 'ejs') ;
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(bodyParser.json()) ; 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()) ; 

//===set up passport 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
      mongooseConnection: mongoose.connection, 
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default 
    })
})); 
app.use(passport.initialize());
app.use(passport.session());

setupPassport() ; 


//===GLOBAL SETTINGS: make sure set this before any routes===
app.use(function(req,res,next){
    res.locals.currentUser = req.user ; 

    next(); 
}) ; 
//do some settings for categories..... 
app.use(function(req, res, next) {
    //go to db, get all the categories, and then assign them to the global var
    Category.find({}, function(err, foundCats){
        if (err) {
            return next(err) ; 
        }
        res.locals.categories = foundCats ; 
            next() ; 
    }) ; 
}); 


//root route
app.get('/', function(req,res){
    res.render('home.ejs');
}) ; 

//routes settings 
var apiRoutes = require("./api/index.js") ; 
var usersRoutes = require("./routes/users.js"); 
var categoriesRoutes = require("./routes/categories.js"); 
var productsRoutes = require("./routes/products.js"); 
app.use('/api', apiRoutes) ; 
app.use(usersRoutes) ; 
app.use(categoriesRoutes) ; 
app.use(productsRoutes) ; 

//start up server
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
    console.log("shops is up!") ;
});
