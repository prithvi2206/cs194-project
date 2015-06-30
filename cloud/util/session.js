'use strict';

var loggingIn = false;
var TOKEN_REFRESH_FREQUENCY = 10;
var MAIL_CALENDAR_FREQUENCY = 600;
var mail = require("./mail.js");
var events = require("./events.js");

exports.isLoggedIn = function(req, res, next) {
	// if user is authenticated in the session, carry on
	if (Parse.User.current()) {
		refreshToken(req, res, next);
		updateMailandCalendar(res);
	} 

	// if they aren't redirect them to the home page
	else { 
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
};

var updateMailandCalendar = function(res) {
	var lastRefreshed = Parse.User.current().get("mailLastRefreshed");
	var currTime = new Date();

	if(!lastRefreshed || ((currTime.getTime() - lastRefreshed.getTime()) > 1000 * MAIL_CALENDAR_FREQUENCY)) {
		console.log("updating mail and calendar\n");
		mail.updateMessagesDB(res);
		events.updateEventsDB(res);

		var user = Parse.User.current();
		if(user) {
			user.set("mailLastRefreshed", new Date());
			/* Save changes */
			user.save()
			.then(function(user) {
				return user.fetch();
			}).then(function(user) {
				console.log('mail refreshed refreshed');
			},function(error) {
				console.log('=================> Something went wrong', error);
			});
		} 
	} else {
		console.log("no need to refresh mail\n");
	}
}

/* next is the wrapper function that makes the google API call 
 * that is passed to refreshToken to be re-called upon successful 
 * upating of the auth token 
 */
var refreshToken = function(req, res, next) {
	if (!next) 
		return;

	var refresh_token = Parse.User.current().get('refresh_token');
	var lastRefreshed = Parse.User.current().get("lastRefreshed");
	var currTime = new Date();
	if(!lastRefreshed || ((currTime.getTime() - lastRefreshed.getTime()) > 1000 * TOKEN_REFRESH_FREQUENCY)) {
		// if(!lastRefreshed) {
		// 	last
		// }
		console.log("refreshing!");
		var user = Parse.User.current();
		user.set("lastRefreshed", new Date());
		user.save();
		refresh.requestNewAccessToken('google', refresh_token, 
			function(err, accessToken, refreshToken) {

				/* handle error */	
				if (err) {
					console.log("error requesting new token");
					res.redirect("/logout");
				}

				// var user = Parse.User.current();
				if(user) {
					user.set("google_token", accessToken);
					/* Save changes */
					user.save()
					.then(function(user) {
						return user.fetch();
					}).then(function(user) {
						console.log('auth token refreshed');
						/* Save changes */
						loggingIn = false;
						/* auth token successfully updated, try again */
						return next();
					},function(error) {
							console.log('=================> Something went wrong', error);
							// res.redirect("/logout");
							refreshToken(req, res, next);
					});
				} 
			}
		);
	} else {
		console.log("no need to refresh");
		return next();
	}
}