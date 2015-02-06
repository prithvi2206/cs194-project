'use strict';

//var auth = require("../controllers/auth_controller.js");

module.exports = function(app) {
	app.get('/messages', function(req, res) {

		if (Parse.User.current()) {

			Parse.User.current().fetch()

			res.render('pages/messages',{ 
				currentUser: Parse.User.current().getUsername(),
				title: "Messages | inturn",
				page: "messages"
			});

		} else {
			res.render('pages/start', {
				message:null,
				title: "Welcome | inturn"
			});
		}

	});
};