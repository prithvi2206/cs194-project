'use strict';

//var auth = require("../controllers/auth_controller.js");

module.exports = function(app) {
	app.get('/events', function(req, res) {

		if (Parse.User.current()) {

			Parse.User.current().fetch()

			res.render('pages/events', { 
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

	});
};

