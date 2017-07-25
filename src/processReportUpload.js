'use strict';
let formidable = require('formidable');
let Unzip = require('decompress-zip');
let fs = require('fs');
let xpath = require('xpath');
let parse5 = require('parse5');
let xmlser = require('xmlserializer');
let dom = require('xmldom').DOMParser;

let Report = require('./report')
let ReportSettings = require('./settings/report')

const uploadDir = './public/uploads/';
const extractDir = './public/extracted/';

//Process file uploads
module.exports = function processReportUpload(request, callback) {
    new processUpload(request, (err, file, project, release, date, report_type) => {
        if (err) {
            console.error(`Error processing file ${file} and upload`);
            callback(err);
            return;
        }
        console.info(`Processed file ${file} successfully`)
        unZipFile(file, (err, extractedDir, folderName) => {
            if (err) {
                console.error(`Error Unzipping the file ${file}`);
                callback(err);
                return;
            }
            console.info(`Extracted file ${file} at ${extractedDir}`)
            new ReportSettings(null, report_type).findByName((err, results) => {
                if (err){
                    console.error(err)
                    callback(err);
                    return;
                }
                let passXpath = results[0].passXpath;
                let errorXpath = results[0].failXpath;
                let skippedXpath = results[0].skippedXpath;
                let summaryFile = results[0].summaryFile;
                let indexFile = results[0].indexFile;
                console.log(results);
                ParseHTML(extractedDir + summaryFile, passXpath, errorXpath, skippedXpath, (err, htmlParsedObj) => {
                    if (err) {
                        console.error(`Error parsing the file ${file}`);
                        callback(err);
                        return;
                    }
                    console.info(`Parsed HTML from file ${file} and directory ${extractedDir}`)
                    console.log(htmlParsedObj);
                    new Report(null, project, release, date, parseInt(htmlParsedObj.passCount), parseInt(htmlParsedObj.errorCount), parseInt(htmlParsedObj.skippedCount), '/extracted/' + folderName + indexFile)
                        .create((err) => {
                            if (err) {
                                console.error(`Error Inserting data into DB for the ${file} and directory ${extractedDir}`);
                                callback(err);
                                return;
                            }

                            console.info(`Inserted data into DB for the ${file} and directory ${extractedDir}`);
                            callback(null);
                        });
                });
            })

        });
    });
}

//Get fields and zip
function processUpload(request, callback) {
    let form = new formidable.IncomingForm();
    let file;
    let release;
    let project;
    let report_type;
    let date;
    let flag;
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(request, (err, fields, files) => {
        if (err) {
            flag = false;
            callback(err);
            return;
        } else if (files['zipped-report'].size === 0) {
            flag = false;
            callback("File Size is: " + files['zipped-report'].size);
            return;
        }
        file = files['zipped-report'].path;
        release = fields.release;
        project = fields.project;
        report_type = fields.report_type;
        date = fields.date;
        flag = true;
    });

    form.on('end', () => {
        if (flag) {
            callback(null, file, project, release, date, report_type);
        } else {
            callback(true);
        }
    });
}

//Unzip the file 
function unZipFile(sourcefile, callback) {
    let folderName = Date.now();
    let targetDir = extractDir + folderName;
    let unzip = new Unzip(sourcefile);

    fs.mkdir(targetDir, (err) => {
        if (err) {
            callback(err);
            return;
        }
        unzip.extract({ path: targetDir });

        unzip.on('extract', () => {
            /* fs.unlink(sourcefile, () => {
                if(err){
                    console.error('Error removing file ' + sourcefile);
                }
            }) */
            callback(null, targetDir, folderName);
        });
    })
}

/**
 * Parses Given HTML file and extract passCount, skippedCount, failCount
 * @param {*} htmlFile - HTML File path
 * @param {*} callback - callback accepting arguments as error, resultObject
 */
function ParseHTML(htmlFile, passXpath, errorXpath, skippedXpath, callback) {
    
        convertToDOMObject(htmlFile, (err, domDoc) => {
        if (err) {
            callback(err);
            return;
        }

        let select = xpath.useNamespaces({ "x": "http://www.w3.org/1999/xhtml" });
        let errorCount = select("string(" + errorXpath + ")", domDoc);
        let passCount = select("string(" + passXpath + ")", domDoc);
        let skippedCount = select("string(" + skippedXpath + ")", domDoc);
        let obj = {};
        obj.errorCount = errorCount;
        obj.passCount = passCount;
        obj.skippedCount = skippedCount;
        callback(null, obj);

    }) 
};

function convertToDOMObject(htmlFile, callback) {
    let fileContent = '';
    let stream = fs.createReadStream(htmlFile);

    stream.on('data', (chunk) => {
        fileContent += chunk;
    });

    stream.on('error', (err) => {
        callback(err);
        return;
    });

    stream.on('end', () => {
        stream.close();
        let document = parse5.parse(fileContent.toString());
        let xhtml = xmlser.serializeToString(document);
        let doc = new dom().parseFromString(xhtml);
        callback(null, doc);
    });

}
