'use strict';

//Core modules
let http = require('http');
let fs = require('fs');
let url = require('url');

//Custom modules
let ProcessUpload = require('./lib/processUpload');
let parseHTML = require('./lib/parseHTML');
let unzip = require('./lib/unZip');
let db = require('./lib/db');
let Report = require('./lib/report');

const config = require('./config')

//Initialize Database - Errors out if DB is not found or problem creating Database
db.initDB();

http.createServer(function (request, response) {
    let path = url.parse(request.url).pathname;

    switch (path) {
        case "/":
            fs.readFile(__dirname + '/view/index.html', 'utf8', (err, data) => {
                if (err) {
                    throw new Error(err);
                }
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            });
            break;
        case "/upload":
            if (request.method === "POST") {
                processRequest(request, (err) => {
                    if (err){
                        console.info(err);
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({success: false}));
                    }

                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({success: true}));
                });
            } else {
                fs.readFile(__dirname + '/view/upload.html', 'utf8', (err, data) => {
                    if (err) {
                        throw new Error(err);
                    }
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(data);
                });
            }
            break;
        case "/reports/all":
            let result = new Report().findAll((err, results) => {
                if(err){
                    console.log(error);
                }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(results));
            })
            break;
        default:
            response.writeHead(404);
            response.end();
    }

}).listen(config.server.port, config.server.host);

function processRequest(request, callback) {
    new ProcessUpload(request, (err, file, project, release, date) => {
        if (err){
            console.error(`Error processing file ${file} and upload`);
            callback(err);
            return;
        }
        console.info(`Processed file ${file} successfully`)
        unzip(file, (err, extractedDir) => {
            if (err){
                console.error(`Error Unzipping the file ${file}`);
                callback(err);
                return;
            }
            console.info(`Extracted file ${file} at ${extractedDir}`)
            parseHTML(extractedDir + config.report.summaryFile, (err, htmlParsedObj) => {
                if (err){
                    console.error(`Error parsing the file ${file}`);
                    callback(err);
                    return;
                }
                console.info(`Parsed HTML from file ${file} and directory ${extractedDir}`)
                new Report(null, project, release, date, parseInt(htmlParsedObj.passCount), parseInt(htmlParsedObj.errorCount), parseInt(htmlParsedObj.skippedCount), extractedDir + config.report.indexFile)
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
        });
    });
}