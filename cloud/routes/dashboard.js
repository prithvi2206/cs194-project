'use strict';

var dash = require("../controllers/dash_controller.js");

module.exports = function(app) {
	app.get('/dashboard', dash.main);
};

