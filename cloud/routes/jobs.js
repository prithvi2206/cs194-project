'use strict';

var jobs = require("../controllers/jobs_controller.js");
var session = require("../util/session.js");

module.exports = function(app) {
	
	app.get('/jobs', session.isLoggedIn, jobs.main);
	app.post('/jobs/add', session.isLoggedIn, jobs.add);
	app.get('/jobs/view/:id?', session.isLoggedIn, jobs.view);
	app.post('/jobs/edit', session.isLoggedIn, jobs.edit);
	app.post('/jobs/doc_upload', session.isLoggedIn, jobs.doc_upload);
	app.post('/jobs/add_existing_document', session.isLoggedIn, jobs.add_existing_document);
	app.post('/jobs/add_contact', session.isLoggedIn, jobs.add_contact);
	app.get('/jobs/get', session.isLoggedIn, jobs.get_jobs);
};