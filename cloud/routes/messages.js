'use strict';

var messages = require("../controllers/messages_controller.js");
var session = require("../util/session.js");

module.exports = function(app) {
	app.get('/messages', session.isLoggedIn, messages.main);
	app.get('/messages/get', session.isLoggedIn, messages.getMessages);
};