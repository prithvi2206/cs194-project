'use strict';

exports.main = function(req, res) {

	Parse.User.current().fetch()

	var token = Parse.User.current().get("google_token");

	// var gcal = new Calendar(token);
	// var gapi = require('node-gmail-api');
	// gapi.auth.authorize(
//     {client_id: clientId, scope: scopes, immediate: false},
//     handleAuthResult);


	// var resource = {
	// 	"summary": "Appointment",
	// 	"location": "Somewhere",
	// 	"start": {
	//  		"dateTime": "2015-02-23T10:00:00.000-07:00"
	// 	},
	// 	"end": {
	// 		"dateTime": "2011-02-23T10:25:00.000-07:00"
	// 	}
	// };
	// var request = gapi.client.calendar.events.insert({
	// 	'calendarId': 'primary',
	// 	'resource': resource
	// });
	// request.execute(function(resp) {
	// 	console.log(resp);
	// });

	res.render('pages/events/main', { 
		currentUser: Parse.User.current().getUsername(),
		title: "Events | inturn",
		page: "events"
	});
};