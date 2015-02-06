'use strict';

exports.main = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch();

		/* Jobs home */
		if(!req.params.op) {

			var AppObj = Parse.Object.extend("Application");
			var query = new Parse.Query(AppObj);
			query.equalTo("userId", Parse.User.current());
			query.find({
				success: function(results) {
					res.render('pages/jobs', { 
						currentUser: Parse.User.current().getUsername(),
						title: "Job Applications | inturn",
						page: "jobs",
						jobs: results
					});
				},
				error: function(error) {
					console.log(error.message);
				}
			});

		}

		/* Add job form */
		else if (req.params.op == "add") {
			res.render('pages/jobs_add', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Add New Job | inturn",
				page: "jobs"
			});
		}
		else {
			res.redirect('/jobs');
		}

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}	
}

exports.add = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch();

		var company = req.body.company;
		var position = req.body.position;
		var description = req.body.desc;

		console.log("Going to add " + company + ", " + position);

		/* Add new Application object */
		var AppObj = Parse.Object.extend("Application");
		var app_entry = new AppObj;
		app_entry.set("userId", Parse.User.current());
		app_entry.set("title", position);
		app_entry.set("company", company);
		app_entry.set("description", description);
		app_entry.save().then(function() { 
		}, function(error) {
			console.log("new app did not save properly");
		});

		res.redirect('/jobs');

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
}