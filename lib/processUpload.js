'use strict';
let formidable = require('formidable');
let fs = require('fs');
let unzip = require('./unZip');
let config = require('../config')

const uploadDir = __dirname + '/../public/uploads/';

module.exports = function processUpload(request, callback) {
    let form = new formidable.IncomingForm();
    let file;
    let release;
    let project;
    let date;
    let flag;
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(request, (err, fields, files) => {
        if (err) {
            flag = false;
            callback(err);
            return;
        }else if(files['zipped-report'].size === 0){
            flag = false;
            callback("File Size is: " + files['zipped-report'].size);
            return;
        }
        file = files['zipped-report'].path;
        release = fields.release;
        project = fields.project;
        date = fields.date;
        flag = true;
    });

    form.on('end', () => {
        if (flag) {
            callback(null, file, project, release, date);
        } else {
            callback(true);
        }
    });
}
