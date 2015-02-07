'use strict';

var docs = require("../controllers/docs_controller.js");

module.exports = function(app) {
    app.get('/documents', docs.main);

    app.post('/documents/upload', docs.upload);

    app.post('/documents/preview', docs.preview);
};
