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