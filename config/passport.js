// config/passport.js

/* Google Auth Strategy */
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load the auth variables
var configAuth = require('./auth');

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================

module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
  	done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
  	done(null, user);
  });

  passport.use(new GoogleStrategy({

      clientID        : configAuth.googleAuth.clientID,
      clientSecret    : configAuth.googleAuth.clientSecret,
      callbackURL     : configAuth.googleAuth.callbackURL,

  },
  function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {

    	var username = profile.emails[0].value;
    	var google_id = profile.id;
    	var google_token = token;

    	Parse.User.logIn(username, google_id, {
    		success: function(user) {
    			return done(null, user);
    		},
    		error: function(user, error) {
    			console.log(error);

    			/* User could not be logged in, so create a new user and log in*/

    			/* Sign user up */
    			Parse.User.signUp(username, google_id, { 
    				ACL: new Parse.ACL(),
    				email: username,
    				google_id: google_id,
    				google_token: google_token }, {
    					success: function(user) {

    						Parse.User.logIn(username, google_id, {
    							success: function(user) {
    								return done (null, user);
    							},
    							error: function(user, error) {
    								return done(null);
    							}
    						});

    					},
    					error: function(user, error) {
    						console.log(error);
    						return done(null);
                      }
                  });

    		}
    	});

    });

}));

};
