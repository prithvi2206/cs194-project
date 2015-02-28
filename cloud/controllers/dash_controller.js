'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");


/* 
 */ 
var mostRecentMessageStored = function() {
	return null;
}

// 	CURRENTLY DOESN'T ACTUALLY ADD MESSAGES, JUST TRIES TO PRINT OUT RELEVANT PARTS
var addMessage = function(message) {
	var gmail_id = message.id;
	var email_type = message.payload.mimeType;
	var headers = message.payload.headers;
	var subject = null;
	var from = null;
	var date_time = null;
	
	for(var i = 0; i < headers.length; i++) {
		if(headers[i].name == "Subject") {
			subject = headers[i].value;
		}
		if(headers[i].name == "From") {
			from = headers[i].value;
		}
		if(headers[i].name == "Date") {
			date_time = headers[i].value;			
		}
	}



	console.log("==================== MESSAGE DATA ====================")
	console.log("id: " + gmail_id);
	console.log("payload mime type: " + email_type);
	console.log("headers");
	console.log("\tsubject: " + subject);
	console.log("\tfrom: " + from);
	console.log("\tdate and time: " + date_time);



	console.log("------------");

	var body = message.payload.body;
	if(body) {
		console.log("Body attachmentId: " + body.attachmentId);
		console.log("Body size: " + body.size);
		console.log("Body data: " + body.data);
	}
	var parts = message.payload.parts;
	if(parts) {
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			console.log("------ Part: ");
			console.log(part)
		};
		// console.log("Number of parts: " + parts.length);
	}
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
	console.log("query: " + query);
	return query;
}

// var some_function_that_uses_node_gmail_api = function() {
// 	/// some call to s.on
// }

// var f = function() {
// 	try {
// 		some_function_that_uses_node_gmail_api();
// 	} catch(error) {
// 		session.refresh_token(f);
// 	}
// }

/* Adds all the messages received from "from" until "to" to the db 
 * if from is null, it's searching from the beginning of time
 * if to is null, it's searching until now
 */
var getAllMessages = function(gmail, from, to) {
	var s = gmail.messages(formLabelRangeSearchQuery("inbox", from, to), {max : 100})
	var count = 0;
	s.on('data', function (d) {
		if(count < 10) {
			addMessage(d);
		}
		count += 1;
		// on the hundredth message, call getAllMessages starting from the time of the last message
		// received, so that you can get the next hundred messages
		// if(count == 100) {
		// 	getAllMessages(gmail, getTime(addMessage), to);
		// }
	})
}


// retrieves all new messages, and inserts the scaped data into the database
var updateMessagesDB = function() {
	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);
	var gmail = new Gmail(token);
	var most_recent_message = mostRecentMessageStored();
	console.log("most recent: " + most_recent_message);
	getAllMessages(gmail, most_recent_message, null);
}

exports.main = function(req, res) {
	var token = Parse.User.current().get("google_token");
	// refreshes the token and calls updateMessagesDB
	session.refreshToken(updateMessagesDB);

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

};

exports.update_profile = function(req, res ) {
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

};

exports.profile = function(req, res) {
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

};
