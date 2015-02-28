'use strict';

exports.isLoggedIn = function(req, res, next) {
	// if user is authenticated in the session, carry on
	if (Parse.User.current()) {
		return next();
	} 

	// if they aren't redirect them to the home page
	else { 
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
};

exports.refreshToken = function() {

	var refresh_token = Parse.User.current().get('refresh_token')

	refresh.requestNewAccessToken('google', refresh_token, 
		function(err, accessToken, refreshToken) {

			var user = Parse.User.current();
			user.set("refresh_token", refreshToken);

			/* Save changes */
			user.save()
			.then(
				function(user) {
					return user.fetch();
				}).then(
				function(user) {
					console.log('auth token refreshed');
				},
				function(error) {
					console.log('Something went wrong', error);
					res.redirect("/logout");
				});

		}
	);
}