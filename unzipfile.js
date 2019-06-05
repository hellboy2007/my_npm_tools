var fs = require('fs')
var path = require("path");
var unzip = require("unzip");

var slog = require('single-line-log').stdout;


// var readstream = fs.createReadStream('./100000039.zip');
// var savepath = './file/20190527';

fs.createReadStream('./100000039.zip').pipe(unzip.Extract({ path: './file/20190527' }));