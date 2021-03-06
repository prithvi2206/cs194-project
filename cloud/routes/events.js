'use strict';

var events = require("../controllers/events_controller.js");
var session = require("../util/session.js");

module.exports = function(app) {
	app.get('/events', session.isLoggedIn, events.main);
	app.get('/events/get', session.isLoggedIn, events.getEvents);
	app.post('/events/add', session.isLoggedIn, events.add);
	app.post('/events/quickadd', session.isLoggedIn, events.quickadd);
};

