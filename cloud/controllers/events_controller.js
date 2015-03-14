'use strict';

var alerts = require("../util/alerts.js");
var session = require("../util/session.js");
var events = require("../util/events.js");

exports.main = function(req, res) {

	Parse.User.current().fetch()

	console.log("Starting...")
	// var clientID = '1073490943584-jihl83sesm1qcm10lik7mu86t5ioh5g5.apps.googleusercontent.com';
//       var clientSecret = 'MKAnbihZSzT75VOC61bapiPQ';
//       var callbackURL ='http://localhost:3000/auth/google/callback';
//       var scope = 'profile email https://www.googleapis.com/auth/calendar https://mail.google.com/';

	// var token = Parse.User.current().get("google_token");
	// // var cal
	// // var gcal = new Calendar(token);
	// var gapi = require('googleapis');
	// // gapi.auth.authorize(
// //     {client_id: clientID, scope: scope, immediate: false},
// //     handleAuthResult);	
	// gapi.client.setApiKey();

	var google = require('googleapis');
	// var urlshortener = google.urlshortener('v3');
	var gcal = google.calendar('v3');
	// var params = { shortUrl: 'http://goo.gl/xKbRu3' };

	// get the long url of a shortened url
	// urlshortener.url.get(params, function (err, response) {
	//   console.log('Long url is', response.longUrl);
	// });
	var resource = {
		"summary": "Appointment",
		"location": "Somewhere",
		"start": {
	 		"dateTime": "2015-02-23T10:00:00.000-07:00"
		},
		"end": {
			"dateTime": "2011-02-23T10:25:00.000-07:00"
		}
	};
	var params = { calendarId: 'primary', resource:  resource};

	// gcal.events.insert(params, function(err, response) {
	// 	console.log("done adding calendar element");
	// });
	
	// gcal.calendarList.list({}, function(err, response) {
	// 	var items = response.items;
	// 	for (var i = 0; i < items.length; i++) {
	// 		console.log(items[i].summary);
	// 	};
	// });

	// var request = gapi.client.calendar.events.insert({
	// 	'calendarId': 'primary',
	// 	'resource': resource
	// });
	// request.execute(function(resp) {
	// 	console.log(resp);
	// });

	events.updateEventsDB(res);

	res.render('pages/events/main', { 
		currentUser: Parse.User.current().getUsername(),
		title: "Events | inturn",
		page: "events"
	});

};
