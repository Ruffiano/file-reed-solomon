const rs = require('../reedsolomon');
const fromString = require('uint8arrays/from-string')
const toString = require('uint8arrays/to-string')
const fs = require("fs");
const path = require('path');

class Salamon {
    constructor(fixture, errorCorrectionLength) {
        this.fixture = fixture;
        this.errorCorrectionLength = errorCorrectionLength;
        this.dataLength = null;
        this.messageLength = null;
        this.dataLength  = null;
        this.encoder = new rs.ReedSolomonEncoder(rs.GenericGF.QR_CODE_FIELD_256());
        this.decoder = new rs.ReedSolomonDecoder(rs.GenericGF.QR_CODE_FIELD_256());
    }

    encode(message) {
        const mergedArray = new Uint8Array(message.length + this.errorCorrectionLength);
        mergedArray.set(message);
        mergedArray.set(this.fixture, message.length);
        return this.encoder.encode(mergedArray, this.errorCorrectionLength);
    }

    decode(message) {
        return this.decoder.decode(message, this.errorCorrectionLength);
    }
}


(()=>{
    const filePath_1 = path.join(__dirname, 'original-file.txt');
    const filePath_2 = path.join(__dirname, 'original-file_2.txt');
    const filePath_3 = path.join(__dirname, 'original-file_3.txt');
    let stringTxt = fs.readFileSync(filePath_1);
    // console.log(stringTxt.toString(), typeof stringTxt);

    let fixture = new Uint8Array([0,0,0,0,0,0,0,0]);
    
    const SL = new Salamon(fixture, fixture.length);

    // encode
    const encoded = SL.encode(stringTxt);
    // console.log('>> encoded: ', encoded);
    // fs.writeFileSync(filePath_2, encoded);

    // Corrupted: 
    for (var i = 0; i < 4; i++) encoded[ Math.floor(Math.random() * encoded.length) ] = 0xff;
    console.log(Array.prototype.join.call(encoded));
    console.log('corrupted: ', toString(encoded))    
    fs.writeFileSync(filePath_2, encoded);
    
    
    // decode
    let encoded_ = fs.readFileSync(filePath_2);
    console.log('encoded_: ', encoded_.length)
    const decoded = SL.decode(encoded_);
    // console.log('<< decoded: ', toString(decoded));
    fs.writeFileSync(filePath_3, decoded);

})();


// (()=>{
//     let stringTxt = fromString("SYNOPSIS This library provides only low-level RS coding classes (faithfully imported from original Zxing). ##");
//     let fixture = new Uint8Array([0,0,0,0,0,0,0,0]);
    
//     const SL = new Salamon(fixture, fixture.length);

//     const encoded = SL.encode(stringTxt);
//     console.log('>> encoded: ', encoded);

//     // Corrupted: 
//     for (var i = 0; i < 4; i++) encoded[ Math.floor(Math.random() * encoded.length) ] = 0xff;
//     console.log(Array.prototype.join.call(encoded));
//     console.log('corrupted: ', toString(encoded))    

//     const decoded = SL.decode(encoded);
//     console.log('<< decoded: ', toString(decoded));

// })();