'use strict';

var alerts = require("../util/alerts.js");


/* 
 */ 
var mostRecentMessageStored = function() {
	return null;
}

var addMessage = function(message) {
	console.log("==================== MESSAGE DATA ====================")
	console.log("\tid: " + message.id);
	console.log("\tpayload part id: " + message.payload.partId);
	console.log("\tpayload mime type: " + message.payload.mimeType);
	console.log("\tpayload filename: " + message.payload.filename);
	console.log("\theaders");
	var headers = message.payload.headers;
	for(var i = 0; i < headers.length; i++) {
		console.log("\t\t" + headers[i].name + ": " + headers[i].value);
	}
	console.log("\tbody: " + message.payload.body);
	console.log("======================================================")
}

var getTime = function(message) {
	return null
}

/* should take care of server time, time zones, and all that bullshit 
this should be more than date specific. the granularity of the ranges should have time 
too, as it's quite possible for someone to receive more emails than the max in one day*/
var formLabelRangeSearchQuery = function(label, from, to) {
	var query = ""
	if(label) {
		query = query + "label:" + label;
	}
	if(from) {
		query = query + " after:" + from;
	}
	if(to) {
		query = query + " before:" + to;
	}
	// return "label:" + label + " after:" + from + " before:" + to;
	console.log("query: " + query);
	return query;
}

/* Adds all the messages received from "from" until "to" to the db 
 */
var getAllMessages = function(gmail, from, to) {
	var s = gmail.messages(formLabelRangeSearchQuery("inbox", from, to), {max : 100})
	var count = 0;
	s.on('data', function (d) {
		if(count < 3) {
			addMessage(d);
		}
		count += 1;
		// if(count == 100) {
		// 	getAllMessages(gmail, getTime(addMessage), to);
		// }
	})

	// get 100 messages
	// on the 100th, call the function again with the new parameters
}

var updateMessagesDB = function() {
	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);
	var gmail = new Gmail(token);
	var most_recent_message = mostRecentMessageStored();
	console.log("mrm: " + most_recent_message);
	getAllMessages(gmail, most_recent_message, null);
}

exports.main = function(req, res) {
	if (Parse.User.current()) {

		updateMessagesDB();

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