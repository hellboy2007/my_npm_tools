var request = require("request");
var fs = require('fs')
var path = require("path");
var unzip = require("unzip");

var slog = require('single-line-log').stdout;

var savePath = path.join(__dirname, 'file', '20190527');
var read_file_path = path.join(__dirname, 'file', 'outfilename.zip');
var readerStream = fs.createReadStream(read_file_path);



console.log(unzip)
// readerStream.pipe(unzip.Extract({ path: savePath })).on("close", () => {
//     console.log('文件解压完成')
// })


fs.createReadStream('./file/outfilename.zip').pipe(unzip.Extract({ path: './file/20190527' })).on("close", ()=>{
    console.log('文件解压完成')
})