'use strict';

/* Function: signup
 * -------------------
 * Parameters
 * 		summary: string
 * 		start: string... should look like '2011-06-03T10:00:00.000-07:00'
 * 		end: string
 * 		location: string
 * 		appId: string 
 */
var signup = function(username, password, res) {
	Parse.User.signUp(username, password, { ACL: new Parse.ACL(), email:username }, {
		success: function(user) {

			Parse.User.logIn(username, password, {
				success: function(user) {
					res.redirect('/dashboard');
				},
				error: function(user, error) {

				}
			});

		},
		error: function(user, error) {
			var errmsg = "User " + username + " already exists"
			res.render('pages/start', {
				message: errmsg,
				title: "Welcome | inturn"
			});
		}
	});
}

var login = function(username, password, res) {
	Parse.User.logIn(username, password, {
		success: function(user) {
			res.redirect('/dashboard');

		},
		error: function(user, error) {
			res.render('pages/start', {
				message: "failed to log in",
				title: "Welcome | inturn"
			});
		}
	});
}

exports.redir_home = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch()
		res.redirect('/dashboard');

	} else { 
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
};

exports.login = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	/* New user */
	if(req.body.sb == "signup") {
		signup(username, password, res);
	} else { /* Existing user */
		login(username, password, res);
	}
}

exports.logout = function(req, res) {
	Parse.User.logOut();
	res.redirect('/');
}