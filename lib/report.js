let db = require('./db');
let Project = require('./settings/project');
let Release = require('./settings/release');
let Report_Settings = require('./settings/report');

let Report = function (id, project, release, date, passCount, failCount, skippedCount, reportPath) {
    this.project = project;
    this.release = release;
    this.date = date || (new Date()).toISOString().substring(0, 19).replace('T', ' '),
        this.passcount = passCount || null;
    this.failcount = failCount || null;
    this.skippedcount = skippedCount || null;
    this.reportpath = reportPath;
    this.id = id;
};

Report.prototype.create = function (callback) {
    delete this.id;

    let release = new Release(null, this.release);
    release.findByName((err, result) => {
        if (err) {
            callback(err);
            return;
        }

        let that = this;
        delete that.release;
        that.release_id = result[0].id;

        let project = new Project(null, this.project, null, this.release_id);
        project.findByNameAndReleaseID((err, result) => {
            if (err) {
                callback(err);
                return;
            }
            console.log(result[0].id);
            delete that.project;
            delete that.release_id;
            that.project_id = result[0].id;
            db.insert('reports', that, (err, result, fields) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, result);
            });
        });
    });
}

    Report.prototype.delete = function (callback) {
        db.deleteRow('reports', { id: this.id }, (err, result, fields) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null, result);
        });
    };

    Report.prototype.findById = function (callback) {
        db.find('reports', { id: this.id }, (err, result, fields) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, result);
        });
    };

    Report.prototype.findAll = function (callback) {
        db.findAll('reports', (err, results, fields) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, results);
        });
    };

    module.exports = Report;