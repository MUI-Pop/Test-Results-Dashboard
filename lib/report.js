let db = require('./db');

let Report = function (id, project, release, date, passCount, failCount, skippedCount, reportPath) {
    this.project = project;
    this.releasename = release;
    this.date = date || (new Date()).toISOString().substring(0, 19).replace('T', ' '),
    this.passcount = passCount || null;
    this.failcount = failCount || null;
    this.skippedcount = skippedCount || null;
    this.reportpath = reportPath;
    this.id = id;
};

Report.prototype.create = function (callback) {
    delete this.id;
    db.insert(this, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        callback(null, result);
    });
};

Report.prototype.findById = function (callback) {
    db.findById(this, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Report.prototype.findAll = function (callback) {
    db.findAll(this, (err, results, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, results);
    });
};

module.exports = Report;