'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
// var btoa = require('btoa')
var mres = null
/** TODOS:
 *  - Change read status, in addition to fetching new mails
 */

/* 
 */ 
var mostRecentMessageStored = function() {
	return null;
}

var sendIfNoDuplicate = function(message_entry, gmail_id, res) {
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("gmailId", gmail_id);
	query.find({
		success: function(results) {
			if(results.length == 0)  {
				message_entry.save().then(function() { 
					console.log("----------- new message saved succesfully");
					displayMessages(res)
				}, function(error) {
					console.log(error);
				});
			} else {
				console.log("the message is already there!")
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	

}

var addIfRelevant = function(gmail_id, subject, from, date_time, body, snippet, flags, res) {
	var from_email = from.substring(from.lastIndexOf("<") + 1, from.length - 1).toLowerCase();
	// console.log(from_email);

	var ContactObj = Parse.Object.extend("Contact");
	var query = new Parse.Query(ContactObj);
	query.equalTo("email", from_email);
	query.find({
		success: function(results) {
			if(results.length == 0) return;
			console.log("------------ found relevant email from " + from_email)
			var MessageObj = Parse.Object.extend("Message");
			var message_entry = new MessageObj;		
			message_entry.set("gmailId", gmail_id);
			message_entry.set("contactId", results[0]);
			message_entry.set("subject", subject);
			message_entry.set("snippet", snippet);
			message_entry.set("body", body.data);
			message_entry.set("flags", flags);
			message_entry.set("userId", Parse.User.current());
			message_entry.set("senderName", results[0].get("name"));
			message_entry.set("senderEmail", results[0].get("email"));

			/* If contact is associated with an app id */
			if (results[0].get("appId")) {
				message_entry.set("appId", results[0].get("appId"));
			}

			var date = new Date(date_time);
			message_entry.set("dateSent", date);	
			sendIfNoDuplicate(message_entry, gmail_id);
		},
		error: function(error) {
			console.log(error.message);
		}
	});	



}

// 	CURRENTLY DOESN'T ACTUALLY ADD MESSAGES, JUST TRIES TO PRINT OUT RELEVANT PARTS
var addMessage = function(message, res) {
	var gmail_id = message.id;
	var email_type = message.payload.mimeType;
	var headers = message.payload.headers;
	var body = message.payload.body;
	var subject = null;
	var from = null;
	var date_time = null;
	var snippet = message.snippet
	var flags = message.labelIds.join()
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

	// console.log("==================== MESSAGE DATA ====================")
	// console.log("id: " + gmail_id);
	// console.log("payload mime type: " + email_type);
	// console.log("headers");

	
	// console.log("\tsubject: " + subject);
	// console.log("\tfrom: " + from);
	// console.log("\tdate and time: " + date_time);
	// console.log("------------");

	// if(body) {
	// 	console.log("Body attachmentId: " + body.attachmentId);
	// 	console.log("Body size: " + body.size);
	// 	console.log("Body data: " + body);
	// }
	// var parts = message.payload.parts;
	// // if(parts) {
	// // 	for (var i = 0; i < parts.length; i++) {
	// // 		var part = parts[i];
	// // 		console.log("------ Part: ");
	// // 		console.log(part)
	// // 	};
	// // 	// console.log("Number of parts: " + parts.length);
	// // }
	// console.log("======================================================")

	addIfRelevant(gmail_id, subject, from, date_time, body, snippet, flags)
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


/* Adds all the messages received from "from" until "to" to the db 
 * if from is null, it's searching from the beginning of time
 * if to is null, it's searching until now
 */
var getAllMessages = function(gmail, from, to, res) {
	var s = gmail.messages(formLabelRangeSearchQuery("inbox", from, to), {max : 100})
	var count = 0;
	s.on('data', function (d) {
		if(count < 100) {
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
var updateMessagesDB = function(res) {
	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);
	var gmail = new Gmail(token);
	var most_recent_message = mostRecentMessageStored();
	console.log("most recent: " + most_recent_message);
	getAllMessages(gmail, most_recent_message, null, res);
}

var displayMessages = function(res) {
	console.log("re-displaying messages")
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			res.render('pages/messages/main', { 
				currentUser: Parse.User.current().getUsername(),
				title: "Messages | inturn",
				page: "messages",
				message: null,
				data: results,
				alerts: alerts.Alert
			});

			alerts.reset();
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

exports.main = function(req, res) {
	updateMessagesDB(res);
	displayMessages(res);
	// res.render('pages/messages/main',{ 
	// 	currentUser: Parse.User.current().getUsername(),
	// 	title: "Messages | inturn",
	// 	page: "messages"
	// });
};