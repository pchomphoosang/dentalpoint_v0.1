/**
 * Module dependencies. hello world
 */
var express = require('express'),
    cookieParser = require('cookie-parser'),
    compress = require('compression'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    expressValidator = require('express-validator'),
    errorHandler = require('errorhandler');
    csrf = require('csurf');

var methodOverride = require('method-override'),
    multipart = require('connect-multiparty');

var _ = require('lodash');

var MongoStore = require('connect-mongo')(session);

var path = require('path'),
    mongoose = require('mongoose'), 
    passport = require('passport'),
    connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home'),
    userController = require('./controllers/user'),
    apiController = require('./controllers/api'),
    contactController = require('./controllers/contact'),
    providerController = require('./controllers/provider'),
    uploadController = require('./controllers/upload'),
    notifyController = require('./controllers/notify');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets'),
    passportConf = require('./config/passport');

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

app.engine('html', require('hbs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

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

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', csrf({ cookie: true }), function(req, res) {
   res.render('index', { csrfToken: req.csrfToken() });
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

app.post('/api/uploads', multipart(), uploadController.upload);

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
    res.redirect('/#account/sociallogin/'+req.user._id);
});

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  //res.redirect(req.session.returnTo || '/');
});


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({log : notifyController.errorNotification}));
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
