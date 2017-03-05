var express    = require('express') ,
    path       = require('path')    ,
    bodyParser = require('body-parser') ,
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

//root route
app.get('/', function(req,res){
    res.render('home.ejs');
}) ; 

//routes settings 
var apiRoutes = require("./api/index.js") ; 
app.use('/api', apiRoutes) ; 

//start up server
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
    console.log("shops is up!") ;
});
