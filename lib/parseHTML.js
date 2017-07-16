'use strict';
let fs = require('fs');
let xpath = require('xpath');
let parse5 = require('parse5');
let xmlser = require('xmlserializer');
let dom = require('xmldom').DOMParser;
let config = require('../config')

/**
 * Parses Given HTML file and extract passCount, skippedCount, failCount
 * @param {*} htmlFile - HTML File path
 * @param {*} callback - callback accepting arguments as error, resultObject
 */
let ParseHTML = function(htmlFile, callback) {

  convertToDOMObject(htmlFile, (err, domDoc) => {
    if(err)
      callback(err);

    let select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
    let errorCount = select("string("+ config.report.failXpath + ")", domDoc);
    let passCount = select("string("+ config.report.passXpath + ")", domDoc);
    let skippedCount = select("string("+ config.report.skippedXpath + ")", domDoc);
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
  });
  
  stream.on('end', () => {
    let document = parse5.parse(fileContent.toString());
    let xhtml = xmlser.serializeToString(document);
    let doc = new dom().parseFromString(xhtml);
    callback(null, doc);
  });
  
}

module.exports = ParseHTML;