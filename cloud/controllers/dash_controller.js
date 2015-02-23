'use strict';

var alerts = require("../util/alerts.js");

exports.main = function(req, res) {
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
					page: "dashboard",
					jobs_count: results.length,
					message: null,
					alerts: alerts.Alert
				});

				alerts.reset();
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
};

exports.update_profile = function(req, res ) {
	if (Parse.User.current()) {

		var user = Parse.User.current();
		var set_status = user.get("password_set")

		user.set("password", req.body.password);
		user.set("password_set", true) && (!set_status);

		if (req.body.first_name != "") {
			user.set("firstName", req.body.first_name);
		}
		if (req.body.last_name != "") {
			user.set("lastName", req.body.last_name);
		}

		user.save()
		.then(
			function(user) {
				return user.fetch();
			}).then(
			function(user) {
				console.log('Password changed');

				if (!set_status) {
					alerts.success("Password succesfully set");
					res.redirect("/dashboard");
				} else {
					alerts.success("Password succesfully changed");
					res.redirect("/dashboard");
				}
			},
			function(error) {
				console.log('Something went wrong', error);
				alerts.error("Error changing password");
				res.redirect("/dashboard");
			});

	} else { 
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}	
};

exports.profile = function(req, res) {
	if (Parse.User.current()) {

		if (!Parse.User.current().get("password_set")) {
			alerts.info("Please set a password");
		}

		Parse.User.current().fetch()
		res.render('pages/profile', {
			user: Parse.User.current(),
			currentUser: Parse.User.current().getUsername(),
			page: null,
			alerts: alerts.Alert,
			title: "Profile | inturn"
		});

		alerts.reset();

	} else { 
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
};