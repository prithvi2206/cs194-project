'use strict';

var messages = require("../controllers/messages_controller.js");

module.exports = function(app) {
	app.get('/messages', messages.main);
};