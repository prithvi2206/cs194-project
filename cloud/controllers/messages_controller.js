'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var mail = require("../util/mail.js");

// var btoa = require('btoa')

var displayMessages = function(res) {
	console.log("re-displaying messages")
	var MessageObj = Parse.Object.extend("Message");
	var query = new Parse.Query(MessageObj);
	query.equalTo("userId", Parse.User.current());
	query.descending("dateSent");
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
	mail.updateMessagesDB(res);

	displayMessages(res);
8
};