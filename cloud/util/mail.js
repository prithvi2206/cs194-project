'use strict';

/* Mail.js
 * The functions implemented in this file handle the logic required to 
 * update the mail database and retrieve relevant messages.
 * 
 * Messages can be retrieved from two sources
 * METHOD 1: From contacts that have already been added (with a gmail query on that contact)
 * 				ex. If I have prithvir@stanford.edu added as a contact, I'll search all messages
 * 				sent from prithvir@stanford.edu
 * METHOD 2: From senders whose email addresses are from a domain that is associated with an 
 * 		  		application that the user has added.
 * 				ex. If I have an application to Google, and I've specified the url google.com,
 * 				I'll search for all emails from a @google.com email address.
 */


// If an email is found via METHOD 2, we avoid messages containing these words, 
// as a simple rule based filtering algorithm.
var kill_words = ["unsubscribe", "un-subscribe", "un-enroll", "unenroll"]
var token;

// for escaping HTML
var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

// Function to allow HTML to be sent, to be displayed in the view Messages window.
var escapeHtml = function(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
	  return entityMap[s];
	});
}

/* Function download_attachment
 * -----------------------------
 * Called when the user cicks on an attachment, requesting to download it.
 * This function is given the attachmentId of the attachment (provided by 
 * google), and requests the attachment from GMail, and then passes it back
 * via a res.send in Base64 format.
 */
exports.download_attachment = function(req, res) {
	var attachmentId = req.params.id;

	// get the attachmentId
	var AttachmentObj = Parse.Object.extend("Attachment");
	var query = new Parse.Query(AttachmentObj);
	query.equalTo("attachmentId", attachmentId);
	query.find({
		success: function(results) {
			if(results.length > 0)  {
				console.log("found attachment");
				return get_attachment(res, results[0].get("attachmentId"), results[0].get("messageId"), results[0].get("userEmail"));
			} else {
				console.log("no attachment found, or the attachment is not yours")
				res.send({data: null});
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

/* Function get_attachment
 * -----------------------
 * Called by download_attachment. This function, given the attachId, messageId, and 
 * the email of the owner user (the three parameters the Google API needs to make 
 * the request), returns the attachment to the user.
 * 
 * Because the node-gmail-api wrapper we used does not support downloading attachments, 
 * we used the bare GMail API to do this. 
 * Unfortunately, this meant we had to re-do the authentication on the backent
 * (this does not change anything from the perspective of the client, except for 
 * a slight lag), but it means that we have to re-establish a separate oauth client
 * for the request
 */
var get_attachment = function(res, attachId, messageId, email) {
	// initialize google's api
	var google = require('googleapis');
	var gmail = google.gmail('v1');
	var configAuth = require('./../../config/auth.js');
	// google auth data for the application
	var CLIENT_ID = '1073490943584-jihl83sesm1qcm10lik7mu86t5ioh5g5.apps.googleusercontent.com';
    var CLIENT_SECRET = 'MKAnbihZSzT75VOC61bapiPQ';
    var REDIRECT_URL =  'http://localhost:3000/auth/google/callback';
    // the token and the refresh token are stored on Parse, so we just get them
    var refreshToken =  Parse.User.current().get("refresh_token");
	var OAuth2 = google.auth.OAuth2
	var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	// Retrieve tokens via token exchange explained above or set them:
	oauth2Client.setCredentials({
	  access_token: token,
	  refresh_token: refreshToken
	});
	// now we create the request, and pass in the authentication, so that 
	// google knows that the request is authenticated.
	var request = gmail.users.messages.attachments.get({
		'id': attachId,
		'messageId': messageId,
		'userId': email, 
		'auth': oauth2Client
	}, function(err, response) {
		console.log("got an answer")
		if(err) {
			console.log(err);
		}
		if(response) {
			res.send({data: response.data});
		}
	});	
}

/* Very simple function to check if an email is not a generic spam message
 * Designed to have very high recall, but variable precision, since the penalty
 * for trashing a recruiting-related email is much higher than the penalty
 * of including an occasional spam email. 
 * This is only used in retrievals triggered by METHOD 2. 
 */
var emailIsRecruitingRelated = function(from, subject, body_text, body_html) {
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

	if(body_html.indexOf("unsubscribe") > -1) {
		return false;
	}
	if(body_html.indexOf("un-subscribe") > -1) {
		return false;
	}
	if(body_html.indexOf("un-enroll") > -1) {
		return false;
	}
	if(body_html.indexOf("unenroll") > -1) {
		return false;
	}

	if(from.indexOf("no-reply") > -1) {
		return false;
	}
	if(from.indexOf("noreply") > -1) {
		return false;
	}
	return true;
}

/* Checks if the message is already in the Parse database (with a query on the gmail id),
 * and if it's not, then insert it into the database. Also adds all attachments 
 * associated with the message.
 */ 
var sendIfNoDuplicate = function(message_entry, gmail_id, attachments) {
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("gmailId", gmail_id);
	query.find({
		success: function(results) {
			if(results.length == 0)  {
				// results.length == 0, so this message is not there. 
				message_entry.save().then(function() { 
					console.log("----------- new message saved succesfully");
				}, function(error) {
					console.log(error);
				});
				// add all attachments
				for (var i = 0; i < attachments.length; i++) {
					addAttachment(attachments[i].attachmentId, attachments[i].filename, attachments[i].message_id);
				};
			} else {
				// console.log("the message is already there!")
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	

}

/* Adds a message when there's a contact.
 * This function ends up being called in both Method 1 and Method 2, because 
 * Method 2 will first create a contact for the sender of the message, and then
 * passin a pointer to that contact into this function. 
 * This was done just to make the code more easily understandable, even though it
 * leads to one additional Parse query.
 * The main work of the funciton is to populate a Message object, and then it passes
 * the message along to sendIfNoDuplicate, to avoid storing duplicate messages.
 */
var addMessageWithContact = function(gmail_id, subject, date_time, body_text, body_html, snippet, flags, contact, attachments) {
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

    if (bodytext.length == 0) bodytext = body_html;

	message_entry.set("bodyHTML", escapeHtml(bodytext));

	message_entry.set("has_attachment", (attachments.length != 0));
	message_entry.set("flags", flags);
	message_entry.set("userId", Parse.User.current());
	message_entry.set("senderName", contact.get("name"));
	message_entry.set("senderEmail", contact.get("email"));
	var date = new Date(date_time);
	message_entry.set("dateSent", date);	
	if (contact.get("appId")) {
		message_entry.set("appId", contact.get("appId"));
	}
	sendIfNoDuplicate(message_entry, gmail_id, attachments);
}

// simple utility function to convert MIME message data from Base64 data to utf-8
var base64ToUtf = function(s) {
	var buffer = new Buffer(s + '', 'base64');
	return buffer.toString("utf-8");
}

/* Populates and sends an attachment object. Remember the attachment database
 * doesn't actually store the file itself (the file is retrieved on demand)
 * from google so that the Parse server doesn't have to do massive file storage.
 */
var addAttachment = function(attachment_id, attachment_name, message_id) {
	var AttachmentObj = Parse.Object.extend("Attachment");
	var attachment_entry = new AttachmentObj;               
	attachment_entry.set("filename", attachment_name);
	attachment_entry.set("userId", Parse.User.current());
	attachment_entry.set("messageId", message_id);
	attachment_entry.set("attachmentId", attachment_id);
	attachment_entry.set("userEmail", Parse.User.current().get("username"));
	
	var AttachmentObj = Parse.Object.extend("AttachmentObj");
	var query = new Parse.Query(AttachmentObj);
	query.equalTo("attachment_id", attachment_id);
	query.find({
		success: function(results) {
			if(results.length == 0) {
				attachment_entry.save().then(function() { 
					console.log("----------- new attachment saved succesfully");
				}, function(error) {
					console.log(error);
				});
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	
}

/*  Adds a message from a contact.
 * This is the starting point of the divergence from Method 2 and Method 1.
 * This, and the following function both take in a message, and use it to
 * parse data and send the relevant parts to addMessageWithContact, which
 * populates a Parse Message object stores it in the database.
 */
var addMessageFromContact = function(message, contact) {
	var gmail_id = message.id;
	if(!(message.payload)) {
		return;
	}
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
	var has_attachment = false;
	var attachments = [];

	/* The following code is to extract the actual body from the MIME message.
	 * Google sends the body as both text and as HTML. MIME messages have 
	 * part structures, which stores data, either text, attachments, or other parts
	 * 
	 * GMail uses this part structure in a specific way, which falls into three cases:
	 * If the message is plaintext, then there aren't parts, and the message is stored
	 * 		in the body of the main part. 
	 * If the message is not just plaintext, and there are no attachments, then the 
	 * 		message is stored as two parts. parts[0] stores the text version of the body
	 * 		and parts[2] stores the HTML version.
	 * If the message is not just plaintext, and there are attachments, then the 
	 * 		text and the HTML are stored as two parts within parts[0], and parts[1]
	 * 		and parts following are all attachments.
	 */
	if(parts && parts[0] && parts[1]) {
		if(parts[0].mimeType.substring(0, 9) == "multipart") {
			// console.log("is multipart");
			var first_parts = parts[0].parts
			body_text = base64ToUtf(first_parts[0].body.data)
			body_html = base64ToUtf(first_parts[1].body.data)
			for (var i = 1; i < parts.length; i++) {
				has_attachment = true;
				attachments.push({
					attachmentId: parts[i].body.attachmentId,
					filename: parts[i].filename,
					message_id:gmail_id
				})
				// addAttachment(parts[i].body.attachmentId, parts[i].filename, gmail_id)
			};
		} else {
			// console.log("is not multipart");
			body_text = base64ToUtf(parts[0].body.data)
			body_html = base64ToUtf(parts[1].body.data)			
		}
	} else {
		body_text = base64ToUtf(message.payload.body.data);
		body_html = base64ToUtf(message.payload.body.data);
	}

	if(!emailIsRecruitingRelated(from_email, subject, body_text, body_html)) {
		return;
	}
	addMessageWithContact(gmail_id, subject, date_time, body_text, body_html, snippet, flags, contact, attachments)
}

/* Adds a message from a application.
 * this is basically the same as the above function, except directed at 
 * Method 2 instead of Method 1. The main difference is that it 
 * creates a new Contact object for the sender of the message.
 */
var addMessageFromApp = function(message, app) {
	var gmail_id = message.id;
	if(!(message.payload)) {
		return;
	}
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

	if(app.get("url") == null || app.get("url") == "" || from_email.indexOf(app.get("url")) == -1) return;

    var msg_str = JSON.stringify(message.payload)
    var body = ""

	body = message.payload.body

	var parts = message.payload.parts;
	var body_text = ""
	var body_html = ""
	var has_attachment = false;
	var attachments = [];
	/* The following code is to extract the actual body from the MIME message.
	 * Google sends the body as both text and as HTML. MIME messages have 
	 * part structures, which stores data, either text, attachments, or other parts
	 * 
	 * GMail uses this part structure in a specific way, which falls into three cases:
	 * If the message is plaintext, then there aren't parts, and the message is stored
	 * 		in the body of the main part. 
	 * If the message is not just plaintext, and there are no attachments, then the 
	 * 		message is stored as two parts. parts[0] stores the text version of the body
	 * 		and parts[2] stores the HTML version.
	 * If the message is not just plaintext, and there are attachments, then the 
	 * 		text and the HTML are stored as two parts within parts[0], and parts[1]
	 * 		and parts following are all attachments.
	 */
	if(parts && parts[0] && parts[1]) {
		if(parts[0].mimeType.substring(0, 9) == "multipart") {
			// console.log("is multipart");
			var first_parts = parts[0].parts
			body_text = base64ToUtf(first_parts[0].body.data)
			body_html = base64ToUtf(first_parts[1].body.data)
			for (var i = 1; i < parts.length; i++) {
				has_attachment = true;
				attachments.push({
					attachmentId: parts[i].body.attachmentId,
					filename: parts[i].filename,
					message_id:gmail_id
				})
				// addAttachment(parts[i].body.attachmentId, parts[i].filename, gmail_id)
			};
		} else {
			// console.log("is not multipart");
			body_text = base64ToUtf(parts[0].body.data)
			body_html = base64ToUtf(parts[1].body.data)			
		}
	} else {
		body_text = base64ToUtf(message.payload.body.data);
		body_html = base64ToUtf(message.payload.body.data);
	}

	if(!emailIsRecruitingRelated(from_email, subject, body_text, body_html)) {
		return;
	}

	var ContactObj = Parse.Object.extend("Contact");
	var query = new Parse.Query(ContactObj);
	query.equalTo("email", from_email);
	console.log("constructed contact query for " + from_email)
	query.find({
		success: function(results) {
			if(results.length == 0)  {
				console.log("the contact for " + from_name + " isn't there")
				var ContactObj = Parse.Object.extend("Contact");
				var contact_entry = new ContactObj;		
				contact_entry.set("appId", app);
				contact_entry.set("company", app.get("company"));
				contact_entry.set("email", from_email);
				contact_entry.set("name", from_name);
				contact_entry.set("notes", "Automatically generated from Messages");
				contact_entry.set("title", "");
				contact_entry.set("userId", Parse.User.current());
				contact_entry.save().then(function() { 
					console.log("new contact saved from message");
					addMessageWithContact(gmail_id, subject, date_time, body_text, body_html, snippet, flags, contact_entry, attachments)
				}, function(error) {
					console.log(error);
				});
			} else {
				console.log("already there")
				addMessageWithContact(gmail_id, subject, date_time, body_text, body_html, snippet, flags, results[0], attachments)
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	
}

/* Forms a query for the google api, for either contacts or domain name
 * Either "contact" or "domain" should be null. 
 * Handles domain parsing to get rid of www and http/https.
 */ 
var formLabelContactAppSearchQuery = function(label, contact, domain) {
	var query = ""
	if(label) {
		query = query + "label:" + label;
	}
	if(contact) {
		query = query + " from:" + contact.get("email");
	}
	if(domain && domain.length > 0) {
		if(domain.indexOf("https://") == 0) {
			domain = domain.substring(8);
		}
		if(domain.indexOf("http://") == 0) {
			domain = domain.substring(7);
		}
		if(domain.indexOf("www.") == 0) {
			domain = domain.substring(4);
		}
		query = query + " from:" + domain;
	}
	console.log("query: " + query);
	return query;
}

/* Starting point for Method 1
 */
var getAllFromContact = function(gmail, contact) {
	var query = formLabelContactAppSearchQuery("inbox", contact, null)
	var s = gmail.messages(query, {max : 100})
	s.on('data', function (d) {
		addMessageFromContact(d, contact);
	})
}

/* Starting point for Method 2 
 */
var getAllFromApplication = function(gmail, app) {
	var query = formLabelContactAppSearchQuery("inbox", null, app.get("url"))
	var s = gmail.messages(query, {max : 100})
	var count = 0;
	s.on('data', function (d) {
		addMessageFromApp(d, app);
	})
}

/* Starting point for the message fetching.
 */ 
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
				/// comment out the following line if messages is doing weird shit.
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
	token = Parse.User.current().get("google_token");
	console.log("token is " + token);
	var gmail = new Gmail(token);
	getAllMessages(gmail);
}
