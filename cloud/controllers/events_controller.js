'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var events = require("../util/events.js");

exports.add = function(req, res) {
	var summary = req.body.summary;
	var start = req.body.start;
	var end = req.body.end;
	var location = req.body.location;
	var appid = req.body.appselect;

	events.addEvent(summary, new Date(start), new Date(end), location, appid, res);
}

exports.quickadd = function(req, res) {
	events.quickAddEvent(req.body.summary, req.body.appselect, res);
}

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

	var AppObj = Parse.Object.extend("Application");
	var query = new Parse.Query(AppObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			res.render('pages/events/main', { 
				currentUser: Parse.User.current(),
				title: "Events | inturn",
				page: "events",
				apps: results
			});
		},
		error: function(error) {
			console.log(error.message);
		}
	});

	

};
