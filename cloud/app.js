
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

app.get('/', function(req, res) {

	if (Parse.User.current()) {
		res.render('pages/dashboard', {message: null, currentUser: Parse.User.current().getUsername() });
	} else { 
		// res.render('pages/index', {message: null, currentUser: null });
		res.render('pages/start', {message:null});
	}

});

app.get('/start', function(req, res) {

  if (Parse.User.current()) {
    res.render('pages/dashboard', {message: null, currentUser: Parse.User.current().getUsername() });
  } else { 
    // res.render('pages/index', {message: null, currentUser: null });
    res.render('pages/start', {message:null});
  }

});

app.post('/login_post', function(req, res) {
	username = req.body.username;
	password = req.body.password;

	/* New user */
	if(req.body.sb == "signup") {
		Parse.User.signUp(username, password, { ACL: new Parse.ACL(), email:username }, {
		  success: function(user) {

		  	Parse.User.logIn(username, password, {
				  success: function(user) {
				  	res.render('pages/dashboard', {message: "User " + username + " succesfully created",
				  		currentUser: Parse.User.current().getUsername()});
				  },
				  error: function(user, error) {
				    
				  }
				});

		  },
		  error: function(user, error) {
		  	errmsg = "User " + username + " already exists"
		  	res.render('pages/start', {message: errmsg});
		  }
		});
	} else { /* Existing user */

		Parse.User.logIn(username, password, {
		  success: function(user) {
		  	res.render('pages/dashboard', {message: "Welcome back, " + username,
		  	currentUser: Parse.User.current().getUsername()});
		  },
		  error: function(user, error) {
		    res.render('pages/start', {message: "failed to log in"});
		  }
		});

	}

});

app.get('/dashboard', function(req, res) {

	if (Parse.User.current()) {
		res.render('pages/dashboard', {currentUser: Parse.User.current().getUsername()});
	} else { 
		res.render('pages/index', {currentUser: null, message: null});
	}

});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
