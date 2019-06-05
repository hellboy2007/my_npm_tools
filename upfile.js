var request        = require("request");
var fs             = require('fs')
var path           = require("path");


var dirPath = path.join(__dirname, 'file');
var stream  = fs.createWriteStream(path.join(dirPath, "tmp.zip"));
var upfileurl     = 'http://10.10.11.107:22200/openWeb/fileUpload/fileUpload'
var backurl       ='http://10.10.11.107:22200/openWeb/min/appVersion/add'

var formData = {
    file: fs.createReadStream(path.join(__dirname, '100000059.zip')),
  };

// console.log(formData)
// console.log(upfileurl)

request.post({
  url: upfileurl, 
  headers: {
    'Authorization':'Bearer 63DE900BBEDC41FAA32B99D0C0B6CDE5'
  },
  formData: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  if(body) {
    console.log('body:', body);
    const obj = JSON.parse(body)
    if(obj.success) {
        console.log('--add action start--')
        request.post({
            url: backurl, 
            headers: {
              'Authorization':'Bearer 63DE900BBEDC41FAA32B99D0C0B6CDE5'
            },
            form: {
                appId:'100000059',
                appVersion:'1.01',
                versionUrl: obj.url,
                Tag: 'not message'
            }
        }, function(err,httpResponse, body){
            if(body) {
                console.log('body-two:', body)
            }
         })
    }
  }
});