'use strict';

var jobs = require("../controllers/jobs_controller.js");

module.exports = function(app) {
	
	app.get('/jobs', jobs.main);
	app.post('/jobs/add', jobs.add);
	app.get('/jobs/view/:id?', jobs.view);
	app.post('/jobs/edit', jobs.edit);
	app.post('/jobs/doc_upload', jobs.doc_upload);
	app.post('/jobs/add_existing_document', jobs.add_existing_document)
};