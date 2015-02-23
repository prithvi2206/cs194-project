'use strict';

var auth = require("../controllers/auth_controller.js");

module.exports = function(app, passport) {
	app.get('/', auth.redir_home);
	app.get('/start', auth.redir_home);
	app.get('/login_post', auth.redir_home);
	app.get('/logout', auth.logout);
	app.post('/login_post', auth.login);

	app.get('/auth/google', 
		passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/gmail.compose'] })
	);

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
    	passport.authenticate('google', {
    		successRedirect : '/profile',
    		failureRedirect : '/start'
    	})
    );
};