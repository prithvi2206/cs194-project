'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var events = require("../util/events.js");

exports.main = function(req, res) {
	var token = Parse.User.current().get("google_token");
	// refreshes the token and calls updateMessagesDB


	Parse.User.current().fetch()

	var AppObj = Parse.Object.extend("Application");
	var query = new Parse.Query(AppObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			res.render('pages/dashboard', { 
				currentUser: Parse.User.current(),
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

};

// var escapeHtml = function(string) {
// 	return String(string).replace(/[&<>"'\/]/g, function (s) {
// 	  return entityMap[s];
// 	});
// }

// var escapeAll = function(messages) {
// 	var html = [];
// 	for (var i = 0; i < messages.length; i++) {
// 		html.push(escapeHtml(messages[i].get("bodyHTML")));
// 	}
// 	return html;
// }

exports.update_profile = function(req, res) {
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

				/* Create inturn calendar and redirect to dashboard */
				var token = Parse.User.current().get("google_token");
				var gcal = require('google-calendar');
				var google_calendar = new gcal.GoogleCalendar(token);
				events.createInturnCal(google_calendar, res);

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

};

exports.profile = function(req, res) {
	if (!Parse.User.current().get("password_set")) {
		alerts.info("Please set a password");
	}

	Parse.User.current().fetch()
	res.render('pages/profile', {
		user: Parse.User.current(),
		currentUser: Parse.User.current(),
		page: null,
		alerts: alerts.Alert,
		title: "Profile | inturn"
	});

	alerts.reset();

};
