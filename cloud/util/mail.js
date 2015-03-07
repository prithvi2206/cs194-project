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
	message_entry.set("bodyText", body_text);
	// if(subject == "Offer Letter") {
	// 	console.log("----------------- what's being added:")
	// 	console.log(body_html);
	// } 
	message_entry.set("bodyHTML", body_html);
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

	// var from_email = from.substring(from.lastIndexOf("<") + 1, from.length - 1).toLowerCase();
	// console.log(from_email);

	// var ContactObj = Parse.Object.extend("Contact");
	// var query = new Parse.Query(ContactObj);
	// query.equalTo("email", from_email);
	// query.find({
	// 	success: function(results) {
	// 		if(results.length == 0) return;
	// 		// console.log("------------ found relevant email from " + from_email)
	// 		var MessageObj = Parse.Object.extend("Message");
	// 		var message_entry = new MessageObj;		
	// 		message_entry.set("gmailId", gmail_id);
	// 		message_entry.set("contactId", results[0]);
	// 		message_entry.set("subject", subject);
	// 		message_entry.set("snippet", snippet);
	// 		message_entry.set("body", body.data);
	// 		message_entry.set("flags", flags);
	// 		message_entry.set("userId", Parse.User.current());
	// 		message_entry.set("senderName", results[0].get("name"));
	// 		message_entry.set("senderEmail", results[0].get("email"));

	// 		/* If contact is associated with an app id */
	// 		if (results[0].get("appId")) {
	// 			message_entry.set("appId", results[0].get("appId"));
	// 		}

	// 		var date = new Date(date_time);
	// 		message_entry.set("dateSent", date);	
	// 		sendIfNoDuplicate(message_entry, gmail_id);
	// 	},
	// 	error: function(error) {
	// 		console.log(error.message);
	// 	}
	// });	



}

var base64ToUtf = function(s) {
	var buffer = new Buffer(s + '', 'base64');
	return buffer.toString("utf-8");
}

// 	CURRENTLY DOESN'T ACTUALLY ADD MESSAGES, JUST TRIES TO PRINT OUT RELEVANT PARTS
var addMessageFromContact = function(message, contact) {
	// parser.on("end", function(mail){
	// 	console.log("From:", mail_object.from);
	//     console.log("Subject:", mail_object.subject); 
	//     console.log("Text body:", mail_object.text); 
 //    });

    // console.log("WRITING")

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
    // console.log(msg_str);
    // console.log("\n\n\n")
	// parser.write(msg_str);

	// if(subject == "Offer Letter") {
	// 	console.log("found it!");
	// 	console.log(msg_str);
	// 	var parts = message.payload.parts;
	// 	body_text = base64ToUtf(parts[0].body.data)
	// 	body_html = base64ToUtf(parts[1].body.data)
	// 	console.log("TYPE" + parts[0].mimeType)
	// 	console.log(body_text);
	// 	console.log("TYPE" + parts[1].mimeType)
	// 	console.log(body_html);
	// }

	body = message.payload.body
	// if(body) {
	// 	console.log(message.payload.body.data)
	// } 
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

		// for (var i = 0; i < parts.length; i++) {
		// 	var part = parts[i];
		// 	console.log("------ Part: ");
		// 	var part_body = base64ToUtf(part.body.data);
		// 	// console.log(part_body) 
		// };
	}	
	addIfRelevant(gmail_id, subject, from, date_time, body_text, body_html, snippet, flags, contact)




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
	// 	console.log("Body data: " + body.data);
	// }
	// var parts = message.payload.parts;
	// if(parts) {
	// 	for (var i = 0; i < parts.length; i++) {
	// 		var part = parts[i];
	// 		console.log("------ Part: ");
	// 		console.log(part.data)
	// 	};
	// 	// console.log("Number of parts: " + parts.length);
	// }
	// console.log("======================================================")

	// addIfRelevant(gmail_id, subject, from, date_time, body, snippet, flags)
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


/* Adds all the messages received from "from" until "to" to the db 
 * if from is null, it's searching from the beginning of time
 * if to is null, it's searching until now
 */
// var getAllMessages = function(gmail, from, to, res) {



// 	// go through all contacts 
// 	// for each contact 

// 	var s = gmail.messages(formLabelRangeSearchQuery("inbox", from, to, null), {max : 100})
// 	var count = 0;
// 	s.on('data', function (d) {
// 		if(count < 1) {
// 			addMessage(d);
// 		}
// 		count += 1;
// 		// on the hundredth message, call getAllMessages starting from the time of the last message
// 		// received, so that you can get the next hundred messages
// 		// if(count == 100) {
// 		// 	getAllMessages(gmail, getTime(addMessage), to);
// 		// }
// 	})
	
// }

var getAllFromContact = function(gmail, contact) {
	// console.log("Contact: " + contact.get("name"));
	var query = formLabelContactSearchQuery("inbox", contact)
	var s = gmail.messages(query, {max : 100})
	// var count = 0
	s.on('data', function (d) {
		// if(count < 1) {
		addMessageFromContact(d, contact);
		// }
		// count++
		// count++
		// if(count < 1) {
		// }
		// on the hundredth message, call getAllMessages starting from the time of the last message
		// received, so that you can get the next hundred messages
		// if(count == 100) {
		// 	getAllMessages(gmail, getTime(addMessage), to);
		// }
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