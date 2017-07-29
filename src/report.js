let db = require('./db');
let Project = require('./settings/project');
let Release = require('./settings/release');
let Report_Settings = require('./settings/report');

let Report = function (id, project, release, date, passCount, failCount, skippedCount, reportPath) {
    this.project = project;
    this.release = release;
    this.date = date;
    this.passcount = passCount || 0;
    this.failcount = failCount || 0;
    this.skippedcount = skippedCount || 0;
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
        db.query('SELECT reports.id, release_table.name AS `Release`, project_table.name AS Project, reports.date, reports.passcount, reports.failcount, reports.skippedcount, reports.reportpath FROM reports, project_table, release_table WHERE reports.project_id = project_table.id AND project_table.release_id = release_table.id;', (err, results, fields) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, results);
        });
    };

    module.exports = Report;