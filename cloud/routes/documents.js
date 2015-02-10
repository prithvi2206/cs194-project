'use strict';

var docs = require("../controllers/docs_controller.js");

module.exports = function(app) {
    app.get('/documents', docs.main);
    app.get('/documents/select/:id', docs.main);
    app.get('/documents/all', docs.retrieveDocuments);
    app.post('/documents/upload', docs.upload);
    app.post('/documents/preview', docs.preview);
    app.get('/documents/delete/:id', docs.delete);
};
