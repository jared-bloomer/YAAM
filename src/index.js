const config = require('config');

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const favicon = require('serve-favicon');

const SERVER_PORT = config.get('server.port');
const SERVER_HOST = config.get('server.host');

// Import Application Routes
const homepage = require('./routes/homepage');

var app = express()
app.use( express.static( "public" ) );

app.set('view engine', 'ejs'); // Use EJS Templating
app.set('views', './views') // Define where Templates will live
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// custom middleware logger
app.use(logger);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // Add body-parser to app object
app.use(cookieParser()); // Activate use of cookies


app.get("/", homepage)

app.use(errorHandler);

app.listen(SERVER_PORT, SERVER_HOST, function () {
    console.log(`Started application on ${SERVER_HOST}:${SERVER_PORT}`)
});