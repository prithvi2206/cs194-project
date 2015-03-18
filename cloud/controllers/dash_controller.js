'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var events = require("../util/events.js");

var main_get_unread = function(req, res, data) {
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {

			/* find number of unread messages */
			var num_unread = 0;
			for (var i = 0; i < results.length; i++) {
				if(results[i].get("flags").indexOf("UNREAD") > -1) {
					num_unread++;
				}
			}
			data["unread"] = num_unread;
			res.render('pages/dashboard', { 
				currentUser: Parse.User.current(),
				title: "Dashboard | inturn",
				page: "dashboard",
				data: data,
				message: null,
				alerts: alerts.Alert
			});

		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

var main_get_events = function(req, res, data) {

	var EventObj = Parse.Object.extend("Event");
	var query_event = new Parse.Query(EventObj);
	query_event.equalTo("userId", Parse.User.current());
	query_event.greaterThanOrEqualTo("start", new Date());
	query_event.find({
		success: function(results) {

			data["events"] = results.length;
			main_get_unread(req, res, data);
		},
		error: function(results) {
			console.log(error.message);
		}
	});
}

exports.main = function(req, res) {

	Parse.User.current().fetch()

	var AppObj = Parse.Object.extend("Application");
	var query = new Parse.Query(AppObj);
	query.equalTo("userId", Parse.User.current());
	query.equalTo("status", "not_applied");
	query.find({
		success: function(results) {

			var data = {};
			data["jobs"] = results.length;

			main_get_events(req, res, data);
		},
		error: function(error) {
			console.log(error.message);
		} 
	});

};

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
