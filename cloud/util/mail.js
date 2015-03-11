'use strict';

/** TODOS:
 *  - Change read status, in addition to fetching new mails
 */

var kill_words = ["unsubscribe", "un-subscribe", "un-enroll", "unenroll"]


/* replace with sexy naive bayes bag of word classification algorithm */
var emailIsRecruitingRelated = function(from, subject, body_text) {
	if(body_text.indexOf("unsubscribe") > -1) {
		return false;
	}
	if(body_text.indexOf("un-subscribe") > -1) {
		return false;
	}
	if(body_text.indexOf("un-enroll") > -1) {
		return false;
	}
	if(body_text.indexOf("unenroll") > -1) {
		return false;
	}
	if(from.contains("no-reply") > -1) {
		return false;
	}
	if(from.contains("noreply") > -1) {
		return false;
	}
	return true;
}

var sendIfNoDuplicate = function(message_entry, gmail_id) {
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("gmailId", gmail_id);
	query.find({
		success: function(results) {
			if(results.length == 0)  {
				// console.log("no duplicate")
				message_entry.save().then(function() { 
					console.log("----------- new message saved succesfully");
				}, function(error) {
					console.log(error);
				});
			} else {
				// console.log("the message is already there!")
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	

}

var addMessageWithContact = function(gmail_id, subject, date_time, body_text, body_html, snippet, flags, contact) {
	var MessageObj = Parse.Object.extend("Message");
	var message_entry = new MessageObj;		
	message_entry.set("gmailId", gmail_id);
	message_entry.set("contactId", contact);
	message_entry.set("subject", subject);
	message_entry.set("snippet", snippet);
	message_entry.set("bodyText", body_text);

	var bodytext = '';
	var m = body_html.match(/<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i);
	if (m) bodytext = m[1];

	message_entry.set("bodyHTML", bodytext);
	message_entry.set("flags", flags);
	message_entry.set("userId", Parse.User.current());
	message_entry.set("senderName", contact.get("name"));
	message_entry.set("senderEmail", contact.get("email"));
	var date = new Date(date_time);
	message_entry.set("dateSent", date);	
	if (contact.get("appId")) {
		message_entry.set("appId", contact.get("appId"));
	}
	sendIfNoDuplicate(message_entry, gmail_id);
}

var base64ToUtf = function(s) {
	var buffer = new Buffer(s + '', 'base64');
	return buffer.toString("utf-8");
}

var addMessageFromContact = function(message, contact) {
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

    var msg_str = JSON.stringify(message.payload)
    var body = ""

	body = message.payload.body

	var parts = message.payload.parts;
	var body_text = ""
	var body_html = ""
	if(parts) {
		if(parts[0].mimeType.substring(0, 9) == "multipart") {
			var first_parts = parts[0].parts
			body_text = base64ToUtf(first_parts[0].body.data)
			body_html = base64ToUtf(first_parts[1].body.data)
		} else {
			body_text = base64ToUtf(parts[0].body.data)
			body_html = base64ToUtf(parts[1].body.data)			
		}
	}	
	addMessageWithContact(gmail_id, subject, date_time, body_text, body_html, snippet, flags, contact)

/*	console.log("==================== MESSAGE DATA ====================")
	console.log("id: " + gmail_id);
	console.log("payload mime type: " + email_type);
	console.log("headers");

	
	console.log("\tsubject: " + subject);
	console.log("\tfrom: " + from);
	console.log("\tdate and time: " + date_time);
	console.log("------------");

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
			console.log(part.data)
		};
		// console.log("Number of parts: " + parts.length);
	}
	console.log("======================================================")*/

}


var addMessageFromApp = function(message, app) {
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

	var ind = from.lastIndexOf("<")
	var from_email = from.substring(ind + 1, from.length - 1)
	var from_name = from.substring(0, ind - 1)


    var msg_str = JSON.stringify(message.payload)
    var body = ""

	body = message.payload.body

	var parts = message.payload.parts;
	var body_text = ""
	var body_html = ""
	if(parts) {
		if(parts[0].mimeType.substring(0, 9) == "multipart") {
			var first_parts = parts[0].parts
			body_text = base64ToUtf(first_parts[0].body.data)
			body_html = base64ToUtf(first_parts[1].body.data)
		} else {
			body_text = base64ToUtf(parts[0].body.data)
			body_html = base64ToUtf(parts[1].body.data)			
		}
	}

	// var ContactObj = Parse.Object.extend("Contact");
	// var query = new Parse.Query(ContactObj);
	// query.equalTo("email", from_email);
	// query.find({
	// 	success: function(results) {
	// 		if(results.length == 0)  {
	// 			console.log("the contact for " + from_name + " isn't there")
	// 			var ContactObj = Parse.Object.extend("Contact");
	// 			var contact_entry = new ContactObj;		
	// 			contact_entry.set("appId", app);
	// 			contact_entry.set("company", app.get("company"));
	// 			contact_entry.set("email", from_email);
	// 			contact_entry.set("name", from_name);
	// 			contact_entry.set("notes", "Automatically generated from Messages");
	// 			contact_entry.set("title", "");
	// 			contact_entry.set("userId", Parse.User.current());
	// 			contact_entry.save().then(function() { 
	// 				addMessageWithContact(gmail_id, subject, date_time, body_text, body_html, snippet, flags, contact_entry)
	// 			}, function(error) {
	// 				console.log(error);
	// 			});
	// 		} else {
	// 			addMessageWithContact(gmail_id, subject, date_time, body_text, body_html, snippet, flags, results[0])
	// 		}
	// 	},
	// 	error: function(error) {
	// 		console.log(error.message);
	// 	}
	// });	



	// addIfRelevant(gmail_id, subject, from, date_time, body_text, body_html, snippet, flags, contact)
}

var getTime = function(message) {
	return null
}

/* should take care of server time, time zones, and all that bullshit 
this should be more than date specific. the granularity of the ranges should have time 
too, as it's quite possible for someone to receive more emails than the max in one day*/
var formLabelRangeSearchQuery = function(label, from, to, sender) {
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
	if(sender) {
		query = query + " from:" + sender;
	}
	for (var i = 0; i < kill_words.length; i++) {
		query = query + " -" + kill_words[i];
	};
	console.log("query: " + query);
	return query;
}

var formLabelContactAppSearchQuery = function(label, contact, domain) {
	var query = ""
	if(label) {
		query = query + "label:" + label;
	}
	if(contact) {
		query = query + " from:" + contact.get("email");
	}
	if(domain && domain.length > 0) {
		query = query + " from:" + domain;
	}
	console.log("query: " + query);
	return query;
}


var getAllFromContact = function(gmail, contact) {
	var query = formLabelContactAppSearchQuery("inbox", contact, null)
	var s = gmail.messages(query, {max : 100})
	s.on('data', function (d) {
		addMessageFromContact(d, contact);
	})
}

var getAllFromApplication = function(gmail, app) {
	var query = formLabelContactAppSearchQuery("inbox", null, app.get("url"))
	var s = gmail.messages(query, {max : 100})
	var count = 0;
	s.on('data', function (d) {
		addMessageFromApp(d, app);
	})
}

var getAllMessages = function(gmail) {
	var ContactObj = Parse.Object.extend("Contact");
	var query = new Parse.Query(ContactObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			var num_contacts = results.length
			console.log("searching for emails from " + num_contacts + " contacts");
			for(var i = 0; i < results.length; i++) {
				getAllFromContact(gmail, results[i]);
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	
	var ApplicationObj = Parse.Object.extend("Application");
	var query = new Parse.Query(ApplicationObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			var num_applications = results.length
			console.log("searching for emails from " + num_applications + " applications");
			for(var i = 0; i < results.length; i++) {
				getAllFromApplication(gmail, results[i]);
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	
}


// retrieves all new messages, and inserts the scaped data into the database
exports.updateMessagesDB = function(res) {
	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);
	var gmail = new Gmail(token);
	getAllMessages(gmail);
}
