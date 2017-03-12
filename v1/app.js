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


//root route
app.get('/', function(req,res){
    res.render('home.ejs');
}) ; 

//routes settings 
var apiRoutes = require("./api/index.js") ; 
var usersRoutes = require("./routes/users.js"); 
app.use('/api', apiRoutes) ; 
app.use(usersRoutes) ; 

//start up server
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
    console.log("shops is up!") ;
});
