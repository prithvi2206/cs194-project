
// Initialize Express in Cloud Code.
require('parse-express-cookie-session')
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var express = require('express');
var app = express();
var $ = require('cloud/node_modules/jquery');
var fs = require('fs');
var multer = require('cloud/node_modules/multer'); // For parsing multipart data

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

app.get('/', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

		res.render('pages/dashboard', {
			message: null, 
			currentUser: Parse.User.current().getUsername(),
			title: "Dashboard | inturn"
		});

	} else { 
		// res.render('pages/index', {message: null, currentUser: null });
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}

});

app.get('/dashboard', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

		res.render('pages/dashboard', {
			currentUser: Parse.User.current().getUsername(),
			title: "Dashboard | inturn"
		});

	} else { 
		res.render('pages/start', {
			message: null,
			title: "Start | inturn"
		});
	}

});

/* JOB APPLICATIONS */
app.get('/jobs/:op?', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch();

		/* Jobs home */
		if(!req.params.op) {
			res.render('pages/jobs', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Job Applications | inturn",
			});
		}

		/* Add job form */
		else if (req.params.op == "add") {
			res.render('pages/jobs_add', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Add New Job | inturn"
			});
		}
		else {
			res.render('pages/jobs', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Job Applications | inturn",
			});
		}

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}

});

app.post('/jobs/:op?', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch();

		if (!req.params.op) {
			res.redirect('/jobs');
		}
		else if (req.params.op == "add") {
			company = req.body.company;
			position = req.body.position;
			notes = req.body.notes;

			console.log("Going to add " + company + ", " + position);

			/* Find matching company entry */
			var company_entry;
			var CompanyObj = Parse.Object.extend("Company");
			var company_query = new Parse.Query(CompanyObj);
			company_query.equalTo("name", company);
			company_query.find({
				success: function(results) {
					if (results.length > 0) {
						console.log("found company");
						company_entry = results[0];
					}
					/* create new company */
					else {
						company_entry = new CompanyObj;
						company_entry.set("name", company);
						company_entry.save().then(function() { 
						}, function(error) {
								console.log("company did not save properly");
						});
					}
				},
				error: function(error) {
					console.log("failed");
				}
			});

			/* Find matching position entry */
			var pos_entry;
			var PositionObj = Parse.Object.extend("Position");
			var pos_query = new Parse.Query(PositionObj);
			pos_query.equalTo("companyId", company_entry);
			pos_query.find({
				success: function(results) {
					if (results.length > 0) {
						pos_entry = results[0];
						console.log("found position");
					}
					/* create new position */
					else {
						pos_entry = new PositionObj;
						pos_entry.set("title", position);
						pos_entry.save().then(function() {
						},
							function(error) {
								console.log("Could not save position");
						});
					}
				}
			});

			// console.log(company_entry.id);
			// console.log(pos_entry.id);

			res.redirect('/jobs');

			// var newJob = new Parse.Object("Application");
	  //               docObject.set("
	  //               docObject.save().then(function() { 
	  //                   console.log("save successful");
	  //                   res.redirect('/documents');
	  //               }, function(error) {
	  //                   console.log("file did not save properly");
	  //       });
		}
		else {
			res.redirect('/jobs');
		}

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
});

app.get('/events', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

		res.render('pages/events', { 
			currentUser: Parse.User.current().getUsername(),
			title: "Events | inturn"
		});

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}

});

app.get('/messages', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

		res.render('pages/messages',{ 
			currentUser: Parse.User.current().getUsername(),
			title: "Messages | inturn"
		});

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}

});

app.get('/documents', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

        var username = Parse.User.current().get("username");
        var Document = Parse.Object.extend("Document");
        var query = new Parse.Query(Document);
        query.equalTo("userId", Parse.User.current());
        query.find({
            success: function(results) {
                res.render('pages/documents',{ 
                    currentUser: Parse.User.current().getUsername(),
                    documents: results,
                    title: "Documents | inturn"
                });
            },
            error: function(error) {
                console.log(error.message);
            }
        });


	} else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}

});

app.post('/documents/upload', function(req, res) {
    if (Parse.User.current()) {
		Parse.User.current().fetch();
   
        var file = req.files.file;
  
       if(file.name !== "") {
            var buffer = new Buffer(file.buffer, 'base64');
            var parseFile = new Parse.File(file.originalname, {base64: buffer.toString("base64")});
            parseFile.save().then(function() {
                var docObject = new Parse.Object("Document");
                
                if(req.body.name) {
                    docObject.set("name", req.body.name);
                } else {
                    docObject.set("name", file.originalname);
                }
                docObject.set("file", parseFile);
                docObject.set("userId", Parse.User.current());
                docObject.save().then(function() { 
                    console.log("save successful");
                    res.redirect('/documents');
                }, function(error) {
                    console.log("file did not save properly");
                });
            }, function(error) {
                console.log("file did not save properly");
            });
       }
	} else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
});

app.get('/contacts/:op?', function(req, res) {
	if (Parse.User.current()) {
		Parse.User.current().fetch();

		/* Contacts home */
		if(!req.params.op) {
			res.render('pages/contacts', { 
				currentUser: Parse.User.current().getUsername(),
				title: "Contacts | inturn" 
			});
		}

		/* Add contact form */
		else if (req.params.op == "add") {
			res.render('pages/contacts_add', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Add New Contact | inturn"
			});
		}
		else {
			res.render('pages/contacts', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Contacts | inturn",
			});
		}


	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}

});

app.post('/contacts/:op?', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch();

		if (!req.params.op) {
			res.redirect('/contacts');
		}
		else if (req.params.op == "add") {
			name = req.body.contact_name;
			title = req.body.contact_title;
			company = req.body.company;
			email = req.body.email;
			phone = req.body.phone;
			notes = req.body.notes;

			console.log("Going to add contact " + name + ", " + title + ", at " + company);

			/* Find matching company entry */
			var company_entry;
			var CompanyObj = Parse.Object.extend("Company");
			var company_query = new Parse.Query(CompanyObj);
			company_query.equalTo("name", company);
			company_query.find({
				success: function(results) {
					if (results.length > 0) {
						console.log("found company");
						company_entry = results[0];
					}
					/* create new company */
					else {
						company_entry = new CompanyObj;
						company_entry.set("name", company);
						company_entry.save().then(function() { 
						}, function(error) {
								console.log("company did not save properly");
						});
					}
				},
				error: function(error) {
					console.log("failed");
				}
			});		
			res.redirect('/contacts');
		}
		else {
			res.redirect('/contacts');
		}

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
});


app.get('/start', function(req, res) {

  if (Parse.User.current()) {

  	Parse.User.current().fetch()

    res.render('pages/dashboard', {
    	message: null, 
    	currentUser: Parse.User.current().getUsername(),
    	title: "Welcome | inturn" 
    });

  } else { 
    // res.render('pages/index', {message: null, currentUser: null });
    res.render('pages/start', {
    	message:null,
    	title: "Welcome | inturn"
    });
  }

});

app.get('/login_post', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

    res.render('pages/dashboard', {
    	message: null, 
    	currentUser: Parse.User.current().getUsername(),
    	title: "Welcome | inturn" 
    });

  } else { 
    // res.render('pages/index', {message: null, currentUser: null });
    res.render('pages/start', {
    	message:null,
    	title: "Welcome | inturn"
    });
  }

});

app.get('/logout', function(req, res) {

	Parse.User.logOut();

	res.redirect('/');

});

/* LOGIN */
app.post('/login_post', function(req, res) {
	username = req.body.username;
	password = req.body.password;

	/* New user */
	if(req.body.sb == "signup") {
		Parse.User.signUp(username, password, { ACL: new Parse.ACL(), email:username }, {
		  success: function(user) {

		  	Parse.User.logIn(username, password, {
				  success: function(user) {

				  	res.render('pages/dashboard', {
				  		message: "User " + username + " succesfully created",
				  		currentUser: Parse.User.current().getUsername(),
				  		title: "Dashboard | inturn"
				  	});

				  },
				  error: function(user, error) {
				    
				  }
				});

		  },
		  error: function(user, error) {
		  	errmsg = "User " + username + " already exists"
		  	res.render('pages/start', {
		  		message: errmsg,
		  		title: "Welcome | inturn"
		  	});
		  }
		});
	} else { /* Existing user */

		Parse.User.logIn(username, password, {
		  success: function(user) {

		  	res.render('pages/dashboard', {
		  		message: "Welcome back, " + username,
		  		currentUser: Parse.User.current().getUsername(),
		  		title: "Dashboard | inturn"
		  	});
		  },
		  error: function(user, error) {
		    res.render('pages/start', {
		    	message: "failed to log in",
		    	title: "Welcome | inturn"
		    });
		  }
		});

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
