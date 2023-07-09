const config = require('config');

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const favicon = require('serve-favicon');
const path = require('path');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')

const db = require('./controllers/db');

const SERVER_PORT = config.get('server.port');
const SERVER_HOST = config.get('server.host');

// Import Application Routes
const initializePassport = require('./passport-config')
initializePassport.initialize(
  passport,
  callsign => db.getUser(callsign),
  id => db.getUserByID(id)
)

var app = express()
app.use( express.static( "public" ) );
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: config.get('salt_secret'),
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.set('view engine', 'ejs'); // Use EJS Templating
app.set('views', './views') // Define where Templates will live
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// custom middleware logger
app.use(logger);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // Add body-parser to app object
app.use(cookieParser()); // Activate use of cookies

//db.updateAstDB();

// Import Routes
const homepageRouter = require('./routes/homepage');
const loginRouter = require('./routes/login');
const userManagementRouter = require('./routes/users');

app.get("/", homepageRouter);
app.get("/login", loginRouter);
app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

app.get("/users", checkAuthenticated, checkIsAdmin, userManagementRouter);
app.get("/users/list", checkAuthenticated, checkIsAdmin, userManagementRouter);
app.get("/users/add", checkAuthenticated, checkIsAdmin, userManagementRouter);
app.post("/users/add", checkAuthenticated, checkIsAdmin, userManagementRouter);

app.use(errorHandler);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function checkIsAdmin(req, res, next) {
    let userData = req.user
    userData.then(function(result) {
        if (result[0].role == 1) { // 1 is the ID for admin role
            next()
        } else {
            return res.redirect('/login')
        }
    })
}

function checkIsNetAdmin(req, res, next) {
    let userData = req.user
    userData.then(function(result) {
        if (result[0].role === 2 || result[0].role === 1) { // 1 is the ID for admin role, 2 is the ID for net_admin role
            next()
        } else {
            return res.redirect('/login')
        }
    })
}

app.listen(SERVER_PORT, SERVER_HOST, function () {
    console.log(`Started application on ${SERVER_HOST}:${SERVER_PORT}`)
});