var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var apikey = require('./config/apikey');


// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

const MONGODB_URI = "mongodb://heroku_jkdqqc7j:2e809o2snsapatirooji25m8sr@ds245927.mlab.com:45927/heroku_jkdqqc7j"
const mongoose = require( 'mongoose' );
mongoose.connect( MONGODB_URI, { useNewUrlParser: true } );
// mongoose.connect( 'mongodb://localhost/mydb', { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const profileController = require('./controllers/profileController')
const matterPostController = require('./controllers/matterPostController')
// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session(
  { secret: 'zzbbyanana',
    resave: false,
    saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["tjhickey724@gmail.com","csjbs2018@gmail.com"];

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="DAYS MATTER MANAGER"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.user = req.user
      res.locals.loggedIn = true
    }
  else {
    res.locals.loggedIn = false
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// we require them to be logged in to see their profile
app.get('/myprofile', isLoggedIn, function(req, res) {
        res.render('myprofile')
    });

app.get('/editProfile',isLoggedIn, (req,res)=>{
  res.render('editProfile')
})

app.get('/showProfiles', isLoggedIn, profileController.getAllProfiles);
app.get('/profiles/:id', isLoggedIn, profileController.getOneProfile);


app.post('/updateProfile',profileController.update)

// add page for editProfile and views
// add router for updateProfile and send browser to /profie

// END OF THE AUTHENTICATION ROUTES

app.use(function(req,res,next){
  console.log("about to look for routes!!!")
  //console.dir(req.headers)
  next()
});


app.get('/', function(req, res, next) {
  res.render('index',{title:"DAYS MATTER MANAGER"});
});


app.get('/matternew',matterPostController.getAllMatterPosts)

app.post('/matternew',matterPostController.saveMatterPost)

app.post('/matterDelete',matterPostController.deleteMatterPost)

app.get('/showPost/:id',
        matterPostController.attachAllMatterComments,
        matterPostController.showOnePost)

app.post('/saveMatterComment',matterPostController.saveMatterComment)



app.get('/sleeptime', (req, res) => {
  res.render('sleeptime',{title:"Sleep Time Calculator"});
});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
