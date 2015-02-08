'use strict';

var docs = require("../controllers/docs_controller.js");

module.exports = function(app) {
    app.get('/documents', docs.main);
    app.get('/documents/:id', docs.main);
    app.post('/documents/upload', docs.upload);
    app.post('/documents/preview', docs.preview);
    app.get('/documents/delete/:id', docs.delete);
};
