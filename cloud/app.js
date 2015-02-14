// Initialize Express in Cloud Code.
var parseExpressHttpsRedirect = require('parse-express-https-redirect')
	, parseExpressCookieSession = require('parse-express-cookie-session')
	, express = require('express')
	, app = express()
//var $ = require('jquery');
	, fs = require('fs')
	, multer = require('multer') // For parsing multipart data
	, moment = require('moment');

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

/* At the top, with other redirect methods before other routes */
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https' && req.headers.host == "localhost")
    res.redirect('https://inturn.herokuapp.com'+req.url)
  else
    next() /* Continue to other routes if we're not redirecting */
});

var auth = require('./routes/auth')(app)
	, dashboard = require('./routes/dashboard')(app)
	, jobs = require('./routes/jobs')(app)
	, events = require('./routes/events')(app)
	, messages = require('./routes/messages')(app)
	, documents = require('./routes/documents')(app)
	, contacts = require('./routes/contacts')(app)

// Attach the Express app to Cloud Code.
app.listen();