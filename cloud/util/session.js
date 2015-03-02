'use strict';

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

	refresh.requestNewAccessToken('google', refresh_token, 
		function(err, accessToken, refreshToken) {

			/* handle error */	
			if (err) {
				console.log("error requesting new token");
				res.redirect("/logout");
			}

			var user = Parse.User.current();
			user.set("google_token", accessToken);

			/* Save changes */
			user.save()
			.then(
				function(user) {
					return user.fetch();
				}).then(
				function(user) {
					console.log('auth token refreshed');
					/* auth token successfully updated, try again */
					return next();
				},
				function(error) {
					console.log('Something went wrong', error);
					res.redirect("/logout");
				});

		}
	);
}