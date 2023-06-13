/* Load Configurations from .env */
require('dotenv').config();

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');


var app = express()

// custom middleware logger
app.use(logger);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // Add body-parser to app object
app.use(cookieParser()); // Activate use of cookies


app.get("/",function(request,response){
    response.send("Hello World!")
})

app.use(errorHandler);

app.listen(10000, function () {
    console.log("Started application on port %d", 10000)
});