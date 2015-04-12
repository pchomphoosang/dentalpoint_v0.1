/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var multer  = require('multer');
var fs = require('fs');
var finish  = false;

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);

var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');

var providerController = require('./controllers/provider');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(expressValidator());

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
          return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        finish  = true;
    }
}));

app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());


//app.use(flash());
/*app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
*/

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

/*
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
*/

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', function() {
   res.redirect('index.html');
});

app.post('/api/uploads', function(req,res) { // upload picture and file
  var response = {};
    if(finish==true){
        console.log(req.files.photo);
        response.pic = req.files.photo.path;
        return  res.json(response);
     }else{
        response.errors = {phoneNumber : "upload failure"}
        return  res.status(422).send(response);
     }
});

app.get('/uploads/:pic', function(req,res) { // download picture and file
    console.log("req.params.pic:"+req.params.pic);
    fs.readFile('./uploads/'+req.params.pic, function(error, data){ 
      if(error) { 
        res.writeHead(404); 
        res.end(); 
      } else { 
        res.writeHead(200, {'content-type': 'img/jpg'});
        res.end(data, 'binary'); } 
      }
    );
});

app.post('/login', userController.postLogin);

app.get('/logout', userController.logout);

app.post('/forgot', userController.postForgot);

app.post('/reset/:token', userController.postReset);

app.post('/signup', userController.postSignup);

app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account/:id', passportConf.isAuthenticated, userController.getProfile);

app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


/**
 * API examples routes.
 */

app.get('/api', apiController.getApi);

/**
 * API Testing API.
 */

app.get('/providers',  providerController.getservice); 
app.post('/providers', providerController.insertprovider);
app.delete('/providers', providerController.deleteservice);

app.get('/search', providerController.searchprovider); 
app.get('/search/:providerId', providerController.getprovider); 
//app.get('/providers', providerController.getprovider);    // get result for search
//app.put('/providers/:userid', providerController.modifyproviderid);


app.get('/api', apiController.getApi);

app.get('/api/lastfm', apiController.getLastfm);

app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);

/**
 * OAuth authentication routes. (Sign in)
 */

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook'), 
  function(req, res) {
    console.log('U1'+ JSON.stringify(req.err));
    console.log('U2'+ JSON.stringify(req.info));
    res.redirect('/#account/sociallogin/'+req.user._id);
});

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
