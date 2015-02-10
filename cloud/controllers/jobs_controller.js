'use strict';

var alerts = require("../util/alerts.js");

/* get documents */
var get_app_docs = function(data, res) {
	var DocObj = Parse.Object.extend("Document");
	var query_doc = new Parse.Query(DocObj);
	query_doc.containedIn("objectId", data["app"].get("documentsId"));
	query_doc.find({
		success: function(results) {
			data["documents"] = results;

			res.render('pages/jobs/view', { 
				currentUser: Parse.User.current().getUsername(),
				title: "View Job | inturn",
				page: "jobs",
				data: data,
				alerts: alerts.Alert
			});

			alerts.reset();

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

exports.doc_upload = function(req, res) {
	if (Parse.User.current()) {
		Parse.User.current().fetch();

		var file = req.files.file;

		if(file.name !== "") {
			var buffer = new Buffer(file.buffer, 'base64');
			var parseFile = new Parse.File(file.originalname, {base64: buffer.toString("base64")});
			parseFile.save().then(function() {
				var docObject = new Parse.Object("Document");
				var file_name;

				if(req.body.name) {
					file_name = req.body.name;
				} else {
					file_name = file.originalname;
				}

				docObject.set("name", file_name);
				docObject.set("file", parseFile);
                docObject.set("extension", file.extension);
                docObject.set("size", file.size/1000 + "KB");
                docObject.add("appId", req.body.application_id);

				docObject.set("userId", Parse.User.current());

				var Document = Parse.Object.extend("Document");
				var doc_query = new Parse.Query(Document);
				doc_query.equalTo("name", file_name);
				doc_query.ascending("version");
				doc_query.find().done(function(results) {
					if(results.length > 0) {
						docObject.set("version", results[results.length-1].get("version") + 1);
					} else {
						docObject.set("version", 1);
					}

					docObject.save().then(function() {
						var JobObj = Parse.Object.extend("Application");
						var job_query = new Parse.Query(JobObj);
						job_query.equalTo("objectId", req.body.application_id);
						job_query.find().done(function(results) {
							results[0].add("documentsId", docObject.id);
							results[0].save().then(function() {
								console.log("save successful");
							res.redirect('/jobs/view/'+req.body.application_id);
							}, function(error) {
								console.log("file did not save properly");
							});
						});
					}, function(error) {
						console.log("file did not save properly");
					});
				});
			}, function(error) {
				console.log("file did not save properly");
			});
		}
	} else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
}

exports.edit = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch();

		var appid = req.body.appid; 
		var company = req.body.company;
		var position = req.body.position;
		var description = req.body.desc;
		var status = req.body.status;


		/* retriev app object */
		var AppObj = Parse.Object.extend("Application");

		var query_job = new Parse.Query(AppObj);
		query_job.equalTo("objectId", appid);
		query_job.find({
			success: function(results) {

				if (results.length == 0) {
					res.redirect("/jobs/");
				}

				var app_entry = results[0];

				app_entry.set("title", position);
				app_entry.set("company", company);
				app_entry.set("status", status);
				app_entry.set("description", description);

				app_entry.save({
					success: function(results) {
						console.log('successfuly edited job');
						alerts.success("application edited successfully");
						res.redirect("/jobs/view/" + appid);
					},
					error: function(error) {
						console.log(error.message);
						alerts.error("failed to edit application");
						res.redirect("/jobs/view/" + appid);
					}
				});

			},
			error: function(error) {
				console.log(error.message);
				alerts.error("failed to edit application");
			}
		});
		

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
}

exports.add_existing_document = function(req, res) {
	if (Parse.User.current()) {
		Parse.User.current().fetch();

		var Document = Parse.Object.extend("Document");
		var doc_query = new Parse.Query(Document);
		doc_query.equalTo("objectId", req.body.document_id);
		doc_query.find().done(function(documents) {
			documents[0].add("appId", req.body.application_id)
			documents[0].save().then(function() {
				var Job = Parse.Object.extend("Application");
				var job_query = new Parse.Query(Job);
				job_query.equalTo("objectId", req.body.application_id);
				job_query.find().done(function(jobs) {
					jobs[0].add("documentsId", req.body.document_id);
					jobs[0].save().then(function() {
						console.log("save successful");
						res.redirect('/jobs/view/'+req.body.application_id);
					}, function(error) {
						console.log("file did not save properly");
					});
				});
			}, function(error) {
				console.log("file did not save properly");
			});
		});
	} else {
		res.render('pages/start', {
			message: null,
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
		var status = req.body.status;

		console.log("Going to add " + company + ", " + position);

		/* Add new Application object */
		var AppObj = Parse.Object.extend("Application");
		var app_entry = new AppObj;
		app_entry.set("userId", Parse.User.current());
		app_entry.set("title", position);
		app_entry.set("company", company);
		app_entry.set("status", status);
		app_entry.set("description", description);

		app_entry.save({
			success: function(results) {
				alerts.success("job added successfully");
				res.redirect("/jobs");
			},
			error: function(error) {
				console.log(error.message);
				alerts.error("failed to add job");
				res.redirect("/jobs");
			}
		});
		
		

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