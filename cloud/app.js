
// Initialize Express in Cloud Code.
require('parse-express-cookie-session')
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var express = require('express');
var app = express();
var $ = require('jquery');
var fs = require('fs');
var multer = require('multer'); // For parsing multipart data
var moment = require('moment');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.
//app.use(express.bodyParser()); // Middleware for reading request body
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('YOUR_SIGNING_SECRET'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 }, fetchUser: true }));
app.use(multer({inMemory: true})); // inMemory creates a temporary buffer for file
app.use(express.static(__dirname + '/public'));

var auth = require('./routes/auth')(app);
var dashboard = require('./routes/dashboard')(app);
var jobs = require('./routes/jobs')(app);
var events = require('./routes/events')(app);
var messages = require('./routes/messages')(app);
var documents = require('./routes/documents')(app);
var contacts = require('./routes/contacts')(app);

// Attach the Express app to Cloud Code.
app.listen();
