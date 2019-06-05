const fs        = require('fs');
var QrCode      = require('qrcode-reader');
var Jimp        = require("jimp");
var buffer      = fs.readFileSync('./qrimg.png');

Jimp.read(buffer, function (err, image) {
    if (err) {
        console.error(err);
    }
    var qr = new QrCode();
    qr.callback = function (err, value) {
        if (err) {
            console.error(err);
        }
        console.log(value.result);
    };
    qr.decode(image.bitmap);
});