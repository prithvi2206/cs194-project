
// Initialize Express in Cloud Code.
require('parse-express-cookie-session')
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var express = require('express');
var app = express();
var $ = require('cloud/node_modules/jquery');
var fs = require('fs');
var multer = require('cloud/node_modules/multer'); // For parsing multipart data
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

app.get('/', function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()
		res.redirect('/dashboard');
		// res.render('pages/dashboard', {
		// 	message: null, 
		// 	currentUser: Parse.User.current().getUsername(),
		// 	title: "Dashboard | inturn"
		// });

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

		var AppObj = Parse.Object.extend("Application");
			var query = new Parse.Query(AppObj);
			query.equalTo("userId", Parse.User.current());
			query.find({
				success: function(results) {
					res.render('pages/dashboard', { 
						currentUser: Parse.User.current().getUsername(),
						title: "Dashboard | inturn",
						jobs_count: results.length,
						message: null
					});
				},
				error: function(error) {
					console.log(error.message);
				}
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

			var AppObj = Parse.Object.extend("Application");
			var query = new Parse.Query(AppObj);
			query.equalTo("userId", Parse.User.current());
			query.find({
				success: function(results) {
					res.render('pages/jobs', { 
						currentUser: Parse.User.current().getUsername(),
						title: "Job Applications | inturn",
						jobs: results
					});
				},
				error: function(error) {
					console.log(error.message);
				}
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
			res.redirect('/jobs');
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

		/* Default jobs home */
		if (!req.params.op) {
			res.redirect('/jobs');
		}

		/* Add new job */
		else if (req.params.op == "add") {
			company = req.body.company;
			position = req.body.position;
			description = req.body.desc;

			console.log("Going to add " + company + ", " + position);

			/* Add new Application object */
			var AppObj = Parse.Object.extend("Application");
			var app_entry = new AppObj;
			app_entry.set("userId", Parse.User.current());
			app_entry.set("title", position);
			app_entry.set("company", company);
			app_entry.set("description", description);
			app_entry.save().then(function() { 
				}, function(error) {
					console.log("new app did not save properly");
			});

			res.redirect('/jobs');

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
        query.find().then(function(results) {
                if(results.length > 0) {
                    versionsQuery = new Parse.Query(Document);
                    versionsQuery.equalTo("name", results[0].get("name"));
                    versionsQuery.ascending("version");
                    versionsQuery.find().then(function(versions) {
                        res.render('pages/documents',{ 
                            currentUser: Parse.User.current().getUsername(),
                            documents: results,
                            versions: versions,
                            active: results[0].id,
                            documentPreviewIFrameSRC: results[0].get("file").url(),
                            title: "Documents | inturn"
                        });
                        console.log(versions);
                    },
                    function(error) {
                        console.log(error.message);
                    });
                } else {
                    res.render('pages/documents',{ 
                        currentUser: Parse.User.current().getUsername(),
                        documents: [],
                        versions: [],
                        active: null,
                        documentPreviewIFrameSRC: "",
                        title: "Documents | inturn"
                    });
                }
            }, 
            function(error) {
                console.log(error.message);
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
                var file_name;

                if(req.body.name) {
                    file_name = req.body.name;
                } else {
                    file_name = file.originalname;
                }
                docObject.set("name", file_name);
                docObject.set("file", parseFile);
                docObject.set("userId", Parse.User.current());
                
                var Document = Parse.Object.extend("Document");
                var query = new Parse.Query(Document);
                query.equalTo("name", file_name);
                query.ascending("version");
                query.find().done(function(results) {
                    if(results.length > 0) {
                        docObject.set("version", results[results.length-1].get("version") + 1);
                    } else {
                        docObject.set("version", 1);
                    }
                    
                    docObject.save().then(function() { 
                        console.log("save successful");
                        res.redirect('/documents');
                    }, function(error) {
                        console.log("file did not save properly");
                    });
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

app.post('/documents/preview', function(req, res) {
    var data = req.body;

    var Document = Parse.Object.extend("Document");
    var query = new Parse.Query(Document);
    query.equalTo("objectId", data["document_id"]);
    query.find({
        success: function(results) {
            console.log(results[0].get("file").url());
            res.send({src: results[0].get("file").url()});
        },
        error: function(error) {
            console.log(error.message);
        }
    });
});

app.get('/contacts/:op?', function(req, res) {
	if (Parse.User.current()) {
		Parse.User.current().fetch();

		/* Contacts home */
		if(!req.params.op) {
			var ContactObj = Parse.Object.extend("Contact");
			var query = new Parse.Query(ContactObj);
			query.equalTo("userId", Parse.User.current());
			query.find({
				success: function(results) {
					res.render('pages/contacts', { 
						currentUser: Parse.User.current().getUsername(),
						title: "Contacts | inturn",
						contacts: results
					});
				},
				error: function(error) {
					console.log(error.message);
				}
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
			res.redirect('pages/contacts');
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
  	res.redirect('/dashboard');

    // res.render('pages/dashboard', {
    // 	message: null, 
    // 	currentUser: Parse.User.current().getUsername(),
    // 	title: "Welcome | inturn" 
    // });

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
		res.redirect('/dashboard');

    // res.render('pages/dashboard', {
    // 	message: null, 
    // 	currentUser: Parse.User.current().getUsername(),
    // 	title: "Welcome | inturn" 
    // });

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

				  	// res.render('pages/dashboard', {
				  	// 	message: "User " + username + " succesfully created",
				  	// 	currentUser: Parse.User.current().getUsername(),
				  	// 	title: "Dashboard | inturn"
				  	// });
		  			res.redirect('/dashboard');

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
		  	res.redirect('/dashboard');
		  	// res.render('pages/dashboard', {
		  	// 	message: "Welcome back, " + username,
		  	// 	currentUser: Parse.User.current().getUsername(),
		  	// 	title: "Dashboard | inturn"
		  	// });
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
