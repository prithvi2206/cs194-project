'use strict';

var getAllEvents = function(res, gcal) {
	// gcal.events.list(calendarId, {maxResults:1}, function(err, data) {
	//     if(err) return res.send(500,err);
	    
	//     console.log(data)
	//     if(data.nextPageToken){
	//       gcal(accessToken).events.list(calendarId, {maxResults:1, pageToken:data.nextPageToken}, function(err, data) {
	//         console.log(data.items)
	//       })
	//     }
	    
 //  	});
	gcal.calendarList.list(function(err, data) {
		console.log(data[0]);
	});

}

exports.createInturnCal = function(gcal) {
	// var cal = ;
	gcal.calendars.insert({
		'summary': 'inturn',
		'timeZone': 'America/Los_Angeles'
	}, function(err, data) {
		if(err) {
			console.log(err);
		}
		if(data) {
			var user = Parse.User.current();
			user.set("cal_id", data.id);
			user.save().then(function() { 
				
				return next;

			}, function(error) {
				console.log(error);
			});
		}
	});
}

// retrieves all new messages, and inserts the scaped data into the database
exports.updateEventsDB = function(res) {
	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);

	var gcal = require('google-calendar');
	var google_calendar = new gcal.GoogleCalendar(token);

}