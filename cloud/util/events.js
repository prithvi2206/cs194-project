'use strict';

var getInturnCalId = function() {
	return Parse.User.current().get("cal_id");
}

/* Function: quickAddEvent
 * -------------------
 * Parameters
 * 		input_string: string, something like "Coffee chat at Coupa Cafe with Prithvi tomorrow at 5pm"
 * 		appId: string, basically the ID of the application
 * 				SENTINEL: empty string, if no application is selected.
 */
exports.quickAddEvent = function(input_string, appId) {
	var token = Parse.User.current().get("google_token");
	var google_calendar = require('google-calendar');
	var gcal = new google_calendar.GoogleCalendar(token);
	gcal.events.quickAdd(getInturnCalId(), input_string, function(err, data) {
		if(err) {
			console.log(err)
		} 
		if(data) {
			var ApplicationObj = Parse.Object.extend("Application");
			var query = new Parse.Query(ApplicationObj);
			query.equalTo("objectId", appId);
			query.find({
				success: function(results) {
					if(results.length > 0) {
						addEventToParse(data, results[0]);
					} else {
						addEventToParse(data, null);
					}
				},
				error: function(error) {
					console.log(error.message);
				}
			});	
		}
	});
}

/* Function: addEvents
 * -------------------
 * Parameters
 * 		summary: string
 * 		start: string... should look like '2011-06-03T10:00:00.000-07:00'
 * 		end: string
 * 		location: string
 * 		appId: string 
 */
exports.addEvent = function(summary, start, end, location, appId) {
	
	var token = Parse.User.current().get("google_token");
	var google_calendar = require('google-calendar');
	var gcal = new google_calendar.GoogleCalendar(token);
	gcal.events.insert(getInturnCalId(), {
	  'summary': summary,
	  'location': location,
	  'start': {
	    'dateTime': start
	  },
	  'end': {
	    'dateTime': end
	  }
	}, function(err, data) {
		if(err) {
			console.log(err)
		} 
		if(data) {
			var ApplicationObj = Parse.Object.extend("Application");
			var query = new Parse.Query(ApplicationObj);
			query.equalTo("objectId", appId);
			query.find({
				success: function(results) {
					addEventToParse(data, results[0]);
				},
				error: function(error) {
					console.log(error.message);
				}
			});	
		}
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
	var EventObj = Parse.Object.extend("Event");
	var query = new Parse.Query(EventObj);
	query.equalTo("google_id", google_event_data.id);
	query.find({
		success: function(results) {
			if(results.length == 0) {
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
			}
			
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
 	 // this.quickAddEvent("Coffee chat at Coupa Cafe with Prithvi tomorrow at 5pm", "qERicYvmA1")
 	 // this.addEvent("random event", "2015-03-13T10:00:00.000-07:0", "2015-03-13T11:00:00.000-07:00", "somewhere", "7HhVvHWvCo");


}