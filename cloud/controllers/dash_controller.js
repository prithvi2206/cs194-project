'use strict';

export.main = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch()

		var AppObj = Parse.Object.extend("Application");
		var query = new Parse.Query(AppObj);
		query.equalTo("userId", Parse.User.current());
		query.find({
			success: function(results) {
				res.render('pages/dashboard', { 
					currentUser: Parse.User.current().getUsername(),
					title: "Dashboard | inturn",
					page: "dashboard",
					jobs_count: results.length,
					message: null
				});
			},
			error: function(error) {
				console.log(error.message);
			}
		});

	} else { 
		res.render('pages/start', {
			message: null,
			title: "Start | inturn"
		});
	}
};