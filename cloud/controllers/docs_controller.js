'use strict';
var docs_util = require("../util/documents.js");

/* 
 * Renders document view
 */
exports.main = function(req, res) {
	Parse.User.current().fetch()

	var username = Parse.User.current().get("username");
	var Document = Parse.Object.extend("Document");
	var query = new Parse.Query(Document);
	query.equalTo("userId", Parse.User.current());
	query.descending("createdAt");
	query.find().then(function(results) {
		if(results.length > 0) {
      results = docs_util.formatDocuments(results);
            var active;
            if(req.params.id) {
                for(var i = 0; i < results.length; i++) {
                        console.log(results[i].id, req.params.id);
                    if(results[i].id == req.params.id) {
                        active = results[i]
                    }
                }
            } else {
                active = results[0];
            }

			var versionsQuery = new Parse.Query(Document);
			versionsQuery.equalTo("name", active["name"]);
			versionsQuery.ascending("version");
			versionsQuery.find().then(function(versions) {
				res.render('pages/documents/main',{ 
					currentUser: Parse.User.current(),
					title: "Documents | inturn",
					page: "documents",
					documents: results,
					versions: versions,
					active: active,
					documentPreviewIFrameSRC: active["file"].url(),
				});
			},
			function(error) {
				console.log(error.message);
			});
		} else {
			res.render('pages/documents/main',{ 
				currentUser: Parse.User.current(),
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
};

/* 
 * Uploads new document
 */
exports.upload = function(req, res) {
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
	      	docObject.set("extension", file.extension);
	      	docObject.set("size", Math.round(file.size/1000) + "KB");

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
};

/* 
 * This route is called by 
 * client-side javascript to
 * return a requested document
 * for preview
 */
exports.preview = function(req, res) {
	var data = req.body;

	var Document = Parse.Object.extend("Document");
	var query = new Parse.Query(Document);
	query.equalTo("objectId", data["document_id"]);
	query.find({
		success: function(results) {
			res.send({src: results[0].get("file").url()});
		},
		error: function(error) {
			console.log(error.message);
		}
	});
};

/* 
 * Deletes a document version 
 * from database
 */
exports.delete = function(req, res) {
	Parse.User.current().fetch();

    console.log(req.params.id);
    var Document = Parse.Object.extend("Document");
    var query = new Parse.Query(Document);
    query.equalTo("objectId", req.params.id);
    query.find().then(function(result) {
        result[0].destroy().then(function() {
            res.redirect("/documents/");
        }, function(error) {
            console.log("file could not be deleted");
        });
    }, function(error) {
        console.log("file could not be found");
    });
};

/* 
 * Retrieves a list of documents and sends
 * as an HTTP response -- to be used by 
 * client side javascript
 */
exports.retrieveDocuments = function(req, res) {
	console.log("retrieving all documents");

	Parse.User.current().fetch();

	var username = Parse.User.current().get("username");
	var Document = Parse.Object.extend("Document");
	var query = new Parse.Query(Document);
	query.equalTo("userId", Parse.User.current());
	query.descending("createdAt");
	query.find().then(function(results) {
		res.send({documents: docs_util.formatDocuments(results)});
	}, function(error) {
		console.log("The system was unable to retreive your documents.");
	});
};
