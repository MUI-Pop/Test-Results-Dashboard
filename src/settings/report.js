let db = require('../db');

let Report_Settings = function (_id, name, passXpath, failXpath, skippedXpath, summaryFile, indexFile) {
    this.name = name;
    this.passXpath = passXpath;
    this.failXpath = failXpath;
    this.skippedXpath = skippedXpath;
    this.summaryFile = summaryFile;
    this.indexFile = indexFile;
    this._id = _id;
};

Report_Settings.prototype.create = function (callback) {
    delete this._id;
    db.insert('report_settings', this, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        callback(null, result);
    });
};

Report_Settings.prototype.delete = function (callback) {
    db.deleteRow('report_settings', { id: this._id }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Report_Settings.prototype.findById = function (callback) {
    db.find('report_settings', { id: this._id }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Report_Settings.prototype.findByName = function (callback) {
    db.find('report_settings', { name: this.name }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Report_Settings.prototype.findAll = function (callback) {
    db.findAll('report_settings', (err, results, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, results);
    });
};

module.exports = Report_Settings;