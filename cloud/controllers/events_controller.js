'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var events = require("../util/events.js");

/* This method retrievs events
*/
exports.getEvents = function(req, res) {
	var EventObj = Parse.Object.extend("Event");
	var query = new Parse.Query(EventObj);

	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			res.send({data: results});
		},
		error: function(error) {
			console.log(error.message);
		}
	});

};

exports.main = function(req, res) {

	Parse.User.current().fetch();

	res.render('pages/events/main', { 
		currentUser: Parse.User.current(),
		title: "Events | inturn",
		page: "events"
	});

};
