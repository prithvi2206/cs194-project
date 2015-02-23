'use strict';

exports.main = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch()

		// var key = Parse.User.current().get("google_token");
		// var Gmail = require('node-gmail-api')
		//   , gmail = new Gmail(key)
		//   , s = gmail.messages('label:inbox', {max: 10})
		 
		// s.on('data', function (d) {
		//   console.log(d.snippet)
		// })

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