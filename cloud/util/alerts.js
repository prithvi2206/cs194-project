'use strict';

var alerts = 
{
	"info" : null,
	"warning" : null,
	"success" : null,
	"error" : null
}

exports.reset = function() {
	for (var key in alerts)
		alerts[key] = null
}

exports.info = function(str) {
	alerts["info"] = str;
}

exports.warning = function(str) {
	alerts["warning"] = str;
}

exports.success = function(str) {
	alerts["success"] = str;
}

exports.error = function(str) {
	alerts["error"] = str;
}

exports.Alert = alerts;
