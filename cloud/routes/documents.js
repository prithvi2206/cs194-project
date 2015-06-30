'use strict';

var docs = require("../controllers/docs_controller.js");
var session = require("../util/session.js");

module.exports = function(app) {
    app.get('/documents', session.isLoggedIn, docs.main);
    app.get('/documents/select/:id', session.isLoggedIn, docs.main);
    app.get('/documents/all', session.isLoggedIn, docs.retrieveDocuments);
    app.post('/documents/upload', session.isLoggedIn, docs.upload);
    app.post('/documents/preview', session.isLoggedIn, docs.preview);
    app.get('/documents/delete/:id', session.isLoggedIn, docs.delete);
};
