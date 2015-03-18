'use strict';
var moment = require("moment");

exports.formatDocuments = function(documents) {
	var result = [];

	for (var doc in documents) {
		var id = documents[doc].id;
		var name = documents[doc].get("name");
		var version = documents[doc].get("version");

		var last_modified = new Date(documents[doc].createdAt);
		var today = new Date();
		var timeDiff = Math.abs(today.getTime() - last_modified.getTime());

		var date_diff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + " days ago"; 
		var size = documents[doc].get("size");
		var extension = documents[doc].get("extension");
		var file = documents[doc].get("file");

		result.push({
			"id": id,
			"name": name,
			"version": version,
			"date_diff": date_diff,
			"size": size,
			"extension": extension,
			"file": file
		});
	}
	return result;
}
