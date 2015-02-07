'use strict';

exports.main = function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

		var username = Parse.User.current().get("username");
		var Document = Parse.Object.extend("Document");
		var query = new Parse.Query(Document);
		query.equalTo("userId", Parse.User.current());
		query.find().then(function(results) {
			if(results.length > 0) {
				var versionsQuery = new Parse.Query(Document);
				versionsQuery.equalTo("name", results[0].get("name"));
				versionsQuery.ascending("version");
				versionsQuery.find().then(function(versions) {
					res.render('pages/documents',{ 
						currentUser: Parse.User.current().getUsername(),
						title: "Documents | inturn",
						page: "documents",
						documents: results,
						versions: versions,
						active: results[0].id,
						documentPreviewIFrameSRC: results[0].get("file").url(),
					});
					console.log(versions);
				},
				function(error) {
					console.log(error.message);
				});
			} else {
				res.render('pages/documents',{ 
					currentUser: Parse.User.current().getUsername(),
					documents: [],
					versions: [],
					active: null,
					documentPreviewIFrameSRC: "",
					title: "Documents | inturn",
					page: "documents"
				});
			}
		}, 
		function(error) {
			console.log(error.message);
		});
	} else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}

};

exports.upload = function(req, res) {
	if (Parse.User.current()) {
		Parse.User.current().fetch();

		var file = req.files.file;

		if(file.name !== "") {
			var buffer = new Buffer(file.buffer, 'base64');
			var parseFile = new Parse.File(file.originalname, {base64: buffer.toString("base64")});
			parseFile.save().then(function() {
				var docObject = new Parse.Object("Document");
				var file_name;

				if(req.body.name) {
					file_name = req.body.name;
				} else {
					file_name = file.originalname;
				}
				docObject.set("name", file_name);
				docObject.set("file", parseFile);
				docObject.set("userId", Parse.User.current());

				var Document = Parse.Object.extend("Document");
				var query = new Parse.Query(Document);
				query.equalTo("name", file_name);
				query.ascending("version");
				query.find().done(function(results) {
					if(results.length > 0) {
						docObject.set("version", results[results.length-1].get("version") + 1);
					} else {
						docObject.set("version", 1);
					}

					docObject.save().then(function() { 
						console.log("save successful");
						res.redirect('/documents');
					}, function(error) {
						console.log("file did not save properly");
					});
				});
			}, function(error) {
				console.log("file did not save properly");
			});
		}
	} else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
	}
};

exports.preview = function(req, res) {
	var data = req.body;

	var Document = Parse.Object.extend("Document");
	var query = new Parse.Query(Document);
	query.equalTo("objectId", data["document_id"]);
	query.find({
		success: function(results) {
			console.log(results[0].get("file").url());
			res.send({src: results[0].get("file").url()});
		},
		error: function(error) {
			console.log(error.message);
		}
	});
};