const fs        = require('fs');
const path      = require('path');
var slog        = require('single-line-log').stdout;
const request   = require('request');
const jetpack   = require('fs-jetpack');
// const filepath = 'node_modules.zip';




var dirPath = path.join(__dirname, 'file');
var savePath = path.join(dirPath, "test2.zip");
var stream  = fs.createWriteStream(savePath);
var url     = 'http://wfgyg0-7cm8jifz9.oss-cn-shenzhen.aliyuncs.com/open/mansweb/2019/5/9/a8c88920-3bd7-4285-96eb-d3f877d92a09.zip'
var url2    = 'http://127.0.0.1:3333/node_modules.zip';
var url3    = 'http://downfile.windows10xz.com/dq1906/GHOST_WIN10_X64_1906DQ.iso';
let fileinfoSize = 0;



request(url2).on('response',function (data) {
    // console.log(data.headers['content-length'])
   
    var total = data.headers['content-length'];
    var fileinfo;
    // console.log(body.length)
    var timer = setInterval(()=>{
        
        if(fileinfoSize <=  total){
            fileinfo        = fs.statSync(savePath);
            fileinfoSize    = fileinfo.size;
            slog(`${fileinfoSize} % / ${total} %`);
        } else {
            clearInterval(timer);
        }
    
        setTimeout(()=>{
            clearInterval(timer);
        },50000)
    },100);


}).pipe(stream).on("close", function (err) {
        console.log("文件下载完毕");
})
