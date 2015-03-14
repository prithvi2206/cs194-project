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

exports.createInturnCal = function(gcal, res) {
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
				
				res.redirect("/dashboard");

			}, function(error) {
				console.log(error);
			});
		}
	});
}

var createNameQuery = function(app) {
	return app.get("company");
}

var createUrlQuery = function(app) {
	return app.get("url");
}

var addEventToParse = function(google_event_data, app) {
	console.log(google_event_data.start.dateTime);
	var EventObj = Parse.Object.extend("Event");
	var query = new Parse.Query(EventObj);
	query.equalTo("google_id", google_event_data.id);
	query.find({
		success: function(results) {
			var event_entry = new EventObj;		
			event_entry.set("desc", google_event_data.summary);
			event_entry.set("appId", app);
			event_entry.set("google_id", google_event_data.id);
			event_entry.set("userId", Parse.User.current());
			event_entry.set("start", new Date(google_event_data.start.dateTime));
			event_entry.set("end", new Date(google_event_data.end.dateTime));
			event_entry.set("location", google_event_data.location);
			event_entry.save().then(function() { 
				console.log("event saved")
			}, function(error) {
				console.log(error);
			});			
		},
		error: function(error) {
			console.log(error.message);
		}
	});	
}

var addEventsFromQuery = function(gcal, query, app) {
	gcal.events.list('primary', {
		"q":query
	}, function(err, data) {
		if(err) {
			console.log(err);
		}
		if(data) {
			console.log(" 					-> 					" + query)
			var num_items = data.items.length
			for (var i = 0; i < num_items; i++) {
				addEventToParse(data.items[i], app)
			};
		}
	})
}

var addEventsFromApplication = function(gcal, app) {
	// create company name query
	var nameQuery = createNameQuery(app);
	console.log(nameQuery);
	addEventsFromQuery(gcal, nameQuery, app);

	// create company url query
	var urlQuery = createUrlQuery(app);
	console.log(urlQuery);
	addEventsFromQuery(gcal, urlQuery, app);
}

var addEventsFromApps = function(gcal) {
  var ApplicationObj = Parse.Object.extend("Application");
	var query = new Parse.Query(ApplicationObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			var num_applications = results.length
			console.log("searching for events from " + num_applications + " applications");
			for(var i = 0; i < results.length; i++) {
				addEventsFromApplication(gcal, results[i]);
			}
		},
		error: function(error) {
			console.log(error.message);
		}
	});	
}

// retrieves all new messages, and inserts the scaped data into the database
exports.updateEventsDB = function(res) {

	var token = Parse.User.current().get("google_token");
	console.log("token is " + token);

	var gcal = require('google-calendar');
	var google_calendar = new gcal.GoogleCalendar(token);

	/* find all the events in the calendar that are 
 	 * 		scheduled by the company (has the url)
 	 *		include the company's name
 	 * 		(optional: search all contacts associated with company)
 	 */


 	/* do a parse query for all job applications
 	 * for each job application:
 	 * 		do a search by company name in events
 	 * 		do a search by company url in events
 	 */

 	 addEventsFromApps(google_calendar)




}