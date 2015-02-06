'use strict';

var auth = require("../controllers/auth_controller.js");

module.exports = function(app) {
	app.get('/', auth.redir_home);
	app.get('/start', auth.redir_home);
	app.get('/login_post', auth.redir_home);
	app.get('/logout', auth.logout);
	app.post('/login_post', auth.login);
};