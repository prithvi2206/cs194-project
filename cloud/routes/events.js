'use strict';

var events = require("../controllers/events_controller.js");

module.exports = function(app) {
	app.get('/events', events.main);
};

