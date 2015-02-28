'use strict';

exports.main = function(req, res) {
	Parse.User.current().fetch()

	res.render('pages/messages/main',{ 
		currentUser: Parse.User.current().getUsername(),
		title: "Messages | inturn",
		page: "messages"
	});
};