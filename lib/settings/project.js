let db = require('../db');
let Release = require('./release');

let Project = function (_id, name, release, release_id) {
    this.name = name;
    this.release = release;
    this._id = _id;
    this.release_id = release_id;
};

Project.prototype.create = function (callback) {
    delete this._id;

    let release = new Release(null, this.release);
    release.findByName( (err, result) => {
        if (err) {
            callback(err);
        }

        delete this.release;
        this.release_id = result[0].id;
        console.log(this);
        db.insert('project_table', this, (err, result, fields) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, result);
        });
    });
};

Project.prototype.delete = function (callback) {
    db.deleteRow('project_table', { id: this._id }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Project.prototype.findById = function (callback) {
    db.find('project_table', { id: this._id }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Project.prototype.findByName = function (callback) {
    db.find('project_table', { name: this.name }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Project.prototype.findAll = function (callback) {
    db.findAll('project_table', (err, results, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, results);
    });
};

Project.prototype.findByNameAndReleaseID = function (callback) {
    delete this._id;
    delete this.release;
    let query = {name: this.name, release_id: this.release_id };
    db.connection.query(`SELECT * FROM project_table WHERE name = '${this.name}' AND release_id = '${this.release_id}'`, (err, results, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, results);
    });
};

/* new Project(null, 'Project A', null, 1).findByNameAndReleaseID((err,results) =>{
    console.log(err);
    console.log(results);
}) */
module.exports = Project;