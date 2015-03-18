'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var mail = require("../util/mail.js");

var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

var escapeHtml = function(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
	  return entityMap[s];
	});
}

var escapeAll = function(messages) {
	var html = [];
	for (var i = 0; i < messages.length; i++) {
		html.push(escapeHtml(messages[i].get("bodyHTML")));
	}
	return html;
}

var displayMessages = function(res) {
	console.log("re-displaying messages")
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("userId", Parse.User.current());
	query.descending("dateSent");

	/* Get Messages */
	query.find({
		success: function(messages) {

			/* Get App IDs */
			var AppObj = Parse.Object.extend("Application");
			var query = new Parse.Query(AppObj);
			query.equalTo("userId", Parse.User.current());
			query.find({
				success: function(results) {
					var msgHtml = escapeAll(messages);

					res.render('pages/messages/main', { 
						currentUser: Parse.User.current(),
						title: "Messages | inturn",
						page: "messages",
						message: null,
						data: messages,
						msgHtml: msgHtml,
						apps: results,
						alerts: alerts.Alert
					});
					
					alerts.reset();

				},
				error: function(error) {
					console.log(error.message);
				}
			});

		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

/* This method retrievs messages based on user criteria:
userid
appid (for app filtering)
*/
exports.getMessages = function(req, res) {
	var AppObj = Parse.Object.extend("Application");
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	var query_app = new Parse.Query(AppObj);

	if(req.params.app != 0) {
		query_app.get(req.params.app, {
		  success: function(appId) {

		    /* Query messages on userId and app Id */
		    query.equalTo("appId", appId);
			query.equalTo("userId", Parse.User.current());
			query.descending("dateSent");
			query.find({
				success: function(results) {
					var msgHtml = escapeAll(results);
					res.send({data: results, msgHtml: msgHtml});
				},
				error: function(error) {
					console.log(error.message);
				}
			});

		  },
		  error: function(object, error) {
		  	console.log(error.message);
		  }
		});

	}

	else {
		/* Query messages on userId and app Id */
		query.equalTo("userId", Parse.User.current());
		query.descending("dateSent");
		query.find({
			success: function(results) {
				res.send({data: results});
			},
			error: function(error) {
				console.log(error.message);
			}
		});
	}
}

exports.getAttachmentIds = function(req, res) {
	var AttachObj = Parse.Object.extend("Attachment");
	var query = new Parse.Query(AttachObj);
	/* Query messages on userId and app Id */
	query.equalTo("messageId", req.params.msg);
	query.find({
		success: function(results) {
			res.send({data: results});
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

exports.getAttachment = function(req, res) {
	mail.download_attachment(req, res);
}

exports.main = function(req, res) {
	mail.updateMessagesDB(res);
	displayMessages(res);
};