'use strict';

var jobs = require("../controllers/jobs_controller.js");

module.exports = function(app) {
	
	app.get('/jobs/:op?', jobs.main);
	app.post('/jobs/add', jobs.add);

};