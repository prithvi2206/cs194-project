'use strict';

exports.main = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch()

		res.render('pages/events/main', { 
			currentUser: Parse.User.current().getUsername(),
			title: "Events | inturn",
			page: "events"
		});

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
};