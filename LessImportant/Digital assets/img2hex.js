f = require('fs');

imgReadBuffer = f.readFileSync('test-pattern.jpg');
imgHexEncode = new Buffer(imgReadBuffer).toString('hex');

// save encode hex of the img
f.writeFileSync('encodeHexImg.txt', imgHexEncode);
// console.log(imgHexEncode);

// recreate the img from the hex
var imgHexDecode = new Buffer(imgHexEncode, 'hex');
f.writeFileSync('decodedHexImage.jpg', imgHexDecode);