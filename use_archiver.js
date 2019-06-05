var fs             = require('fs')
var archiver       = require('archiver');
var path           = require("path");


var dirPath = path.join(__dirname, 'file');

var output  = fs.createWriteStream('./file/outfilename.zip');
var archive = archiver('zip');

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);

archive.directory('./file/20190513/', '20180125/dist'); // 指定压缩源及内层的目录结构

archive.finalize();

output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function() {
    console.log('Data has been drained');
});