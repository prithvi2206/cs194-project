'use strict';

var contacts = require("../controllers/contacts_controller.js");
var session = require("../util/session.js");

module.exports = function(app) {

	app.get('/contacts/:op?', session.isLoggedIn, contacts.main);
	app.post('/contacts/add', session.isLoggedIn, contacts.add);
	app.post('/contacts/edit', session.isLoggedIn, contacts.edit);
};