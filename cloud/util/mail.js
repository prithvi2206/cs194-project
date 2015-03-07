'use strict';

/** TODOS:
 *  - Change read status, in addition to fetching new mails
 */

/* 
 */ 
var mostRecentMessageStored = function() {
	return null;
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
					// console.log("----------- new message saved succesfully");
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

var addIfRelevant = function(gmail_id, subject, from, date_time, body_text, body_html, snippet, flags, contact) {
	var MessageObj = Parse.Object.extend("Message");
	var message_entry = new MessageObj;		
	message_entry.set("gmailId", gmail_id);
	message_entry.set("contactId", contact);
	message_entry.set("subject", subject);
	message_entry.set("snippet", snippet);
	message_entry.set("bodyText", body_text.replace(/"/g, "'"));

	var bodytext = '';
	var m = body_html.match(/<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i);
	if (m) bodytext = m[1];

	message_entry.set("bodyHTML", bodytext.replace(/"/g, "'"));
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

var addAttachment = function(attachment_id, attachment_name, message_id) {
	var AttachmentObj = Parse.Object.extend("Attachment");
	var attachment_entry = new AttachmentObj;		
	attachment_entry.set("filename", attachment_name);
	attachment_entry.set("userId", Parse.User.current());
	attachment_entry.set("messageId", message_id);
	attachment_entry.set("attachmentId", attachment_id);
	// console.log(attachment_name + " " + attachment_id + " " + message_id)
	attachment_entry.save().then(function() { 
		console.log("----------- new attachment saved succesfully");
	}, function(error) {
		console.log(error);
	});
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
			for (var i = 1; i < parts.length; i++) {
				addAttachment(parts[i].body.attachmentId, parts[i].filename, gmail_id)
			};
		} else {
			body_text = base64ToUtf(parts[0].body.data)
			body_html = base64ToUtf(parts[1].body.data)			
		}
	}	
	addIfRelevant(gmail_id, subject, from, date_time, body_text, body_html, snippet, flags, contact)

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
	console.log("query: " + query);
	return query;
}

var formLabelContactSearchQuery = function(label, contact) {
	var query = ""
	if(label) {
		query = query + "label:" + label;
	}
	if(contact) {
		query = query + " from:" + contact.get("email");
	}
	console.log("query: " + query);
	return query;
}


var getAllFromContact = function(gmail, contact) {
	var query = formLabelContactSearchQuery("inbox", contact)
	var s = gmail.messages(query, {max : 100})
	s.on('data', function (d) {
		addMessageFromContact(d, contact);
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
}


// retrieves all new messages, and inserts the scaped data into the database
exports.updateMessagesDB = function(res) {
	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);
	var gmail = new Gmail(token);
	var most_recent_message = mostRecentMessageStored();
	console.log("most recent: " + most_recent_message);
	getAllMessages(gmail);
}