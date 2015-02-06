'use strict';

var contacts = require("../controllers/contacts_controller.js");

module.exports = function(app) {
	app.get('/contacts/:op?', contacts.main);
	app.post('/contacts/add', contacts.add);
};