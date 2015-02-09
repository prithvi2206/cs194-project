'use strict';

var jobs = require("../controllers/jobs_controller.js");

module.exports = function(app) {
	
	app.get('/jobs', jobs.main);
	app.post('/jobs/add', jobs.add);
	app.get('/jobs/view/:id?', jobs.view);
	app.post('/jobs/edit', jobs.edit);

};