'use strict';

var alerts = require("../util/alerts.js");

/* get documents */
var get_app_docs = function(data, res) {

	var DocObj = Parse.Object.extend("Document");
	var query_doc = new Parse.Query(DocObj);
	query_doc.equalTo("appId", data["app"]);
	query_doc.find({
		success: function(results) {

			data["documents"] = results;

			res.render('pages/jobs/view', { 
				currentUser: Parse.User.current().getUsername(),
				title: "View Job | inturn",
				page: "jobs",
				data: data
			});

		},
		error: function(results) {
			console.log(error.message);
		}
	});
}

/* get contacts */
var get_app_contacts = function(data, res) {

	var ContactObj = Parse.Object.extend("Contact");
	var query_contact = new Parse.Query(ContactObj);
	query_contact.equalTo("appId", data["app"]);
	query_contact.find({
		success: function(results) {
			data["contacts"] = results;
			get_app_docs(data, res);
		},
		error: function(results) {
			console.log(error.message);
		}
	});
}

var render_job_view = function(appObj, res) {

	/* Create and initialize results object */
	var data = new Object();
	data["app"] = appObj;
	data["events"] = [];
	data["messages"] = [];
	data["contacts"] = [];
	data["documents"] = [];

	get_app_contacts(data, res);

}

exports.view = function(req, res) {
	if (Parse.User.current()) {

		var jobId = req.params.id;

		if (jobId) {

			var JobObj = Parse.Object.extend("Application");
			var query_job = new Parse.Query(JobObj);
			query_job.equalTo("objectId", jobId);
			query_job.find({
				success: function(results) {

					if (results.length == 0) {
						res.redirect("/jobs/");
					}

					render_job_view(results[0], res);

				},
				error: function(error) {
					console.log(error.message);
				}
			});

		} else {
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

		alerts.success("job added successfully");
		res.redirect("/jobs");

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
}

exports.main = function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch();

		var AppObj = Parse.Object.extend("Application");
		var query = new Parse.Query(AppObj);
		query.equalTo("userId", Parse.User.current());
		query.find({
			success: function(results) {
				res.render('pages/jobs/main', { 
					currentUser: Parse.User.current().getUsername(),
					title: "Job Applications | inturn",
					page: "jobs",
					jobs: results,
					alerts: alerts.Alert
				});

				alerts.reset();
			},
			error: function(error) {
				console.log(error.message);
			}
		});

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}	
}