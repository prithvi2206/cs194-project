'use strict';

var dash = require("../controllers/dash_controller.js");
var session = require("../util/session.js");

module.exports = function(app) {
	app.get('/dashboard', session.isLoggedIn, dash.main);
	app.get('/profile', session.isLoggedIn, dash.profile);
	app.post('/profile/update', session.isLoggedIn, dash.update_profile);
};

