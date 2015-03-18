'use strict';

var loggingIn = false;

exports.isLoggedIn = function(req, res, next) {
	// if user is authenticated in the session, carry on
	if (Parse.User.current()) {
		refreshToken(req, res, next);
	} 

	// if they aren't redirect them to the home page
	else { 
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
};

/* next is the wrapper function that makes the google API call 
 * that is passed to refreshToken to be re-called upon successful 
 * upating of the auth token 
 */
var refreshToken = function(req, res, next) {
	var refresh_token = Parse.User.current().get('refresh_token');
	var lastRefreshed = Parse.User.current().get("lastRefreshed");
	var currTime = new Date();
	if(!lastRefreshed || ((currTime.getTime() - lastRefreshed.getTime()) > 1000*10)) {
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
							return refreshToken(req, res, next);
					});
				} 
			}
		);
	} else {
		console.log("no need to refresh");
		return next();
	}
}