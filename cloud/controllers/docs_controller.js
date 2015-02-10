'use strict';

exports.main = function(req, res) {

	if (Parse.User.current()) {

		Parse.User.current().fetch()

		var username = Parse.User.current().get("username");
		var Document = Parse.Object.extend("Document");
		var query = new Parse.Query(Document);
		query.equalTo("userId", Parse.User.current());
		query.descending("createdAt");
		query.find().then(function(results) {
			if(results.length > 0) {
                var active;
                if(req.params.id) {
                    for(var i = 0; i < results.length; i++) {
                        if(results[i].id == req.params.id) {
                            active = results[i]
                        }
                    }
                } else {
                    active = results[0];
                }

				var versionsQuery = new Parse.Query(Document);
				versionsQuery.equalTo("name", active.get("name"));
				versionsQuery.ascending("version");
				versionsQuery.find().then(function(versions) {
                    console.log(active);
					res.render('pages/documents/main',{ 
						currentUser: Parse.User.current().getUsername(),
						title: "Documents | inturn",
						page: "documents",
						documents: results,
						versions: versions,
						active: active,
						documentPreviewIFrameSRC: active.get("file").url(),
					});
				},
				function(error) {
					console.log(error.message);
				});
			} else {
				res.render('pages/documents/main',{ 
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
                docObject.set("extension", file.extension);
                docObject.set("size", file.size/1000 + "KB");

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
			res.send({src: results[0].get("file").url()});
		},
		error: function(error) {
			console.log(error.message);
		}
	});
};

exports.delete = function(req, res) {
	if (Parse.User.current()) {
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
    } else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
    }
};

exports.retrieveDocuments = function(req, res) {
	console.log("retrieving all documents");
	if (Parse.User.current()) {

		Parse.User.current().fetch();

		var username = Parse.User.current().get("username");
		var Document = Parse.Object.extend("Document");
		var query = new Parse.Query(Document);
		query.equalTo("userId", Parse.User.current());
		query.descending("createdAt");
		query.find().then(function(results) {
			res.send({documents: results});
		}, function(error) {
			console.log("The system was unable to retreive your documents.");
		});

	} else {
		res.render('pages/start', {
			message: null,
			title: "Welcome | inturn"
		});
    }
};
