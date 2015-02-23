'use strict';

var dash = require("../controllers/dash_controller.js");

module.exports = function(app) {
	app.get('/dashboard', dash.main);
	app.get('/profile', dash.profile);
	app.post('/profile/update', dash.update_profile);
};

