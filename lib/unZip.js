'use strict';
let Unzip = require('decompress-zip');
let fs = require('fs');

const extractDir = __dirname + '/../public/extracted/';

function unZipFile(sourcefile, callback) {
    let targetDir = extractDir + Date.now();
    let unzip = new Unzip(sourcefile);

    fs.mkdir(targetDir, (err) => {
        if (err) {
            callback(err);
            return;
        }
        unzip.extract({ path: targetDir });

        unzip.on('extract', () => {
            callback(null, targetDir);
        });
    })
}

module.exports = unZipFile;