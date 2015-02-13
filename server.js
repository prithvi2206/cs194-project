var path = require("path");
var forever = require('forever-monitor');
var rc = require("rc");
var pargs = process.argv.slice(2);

var options = (function(args) {
    'use strict';

    var r = {path: "./"};
    while(args.length){
        var a = args.shift();
        if (a.indexOf("/") > -1) {
            r.path = a;
        } else {
            r.app = a;
        }
    }
    return r;
})(pargs);

var Server = require("./lib/ParseServer");
var e = new Server(options.app);
e.start();