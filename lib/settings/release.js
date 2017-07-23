let db = require('../db');

let Release = function (_id, name) {
    this.name = name;
    this._id = _id;
};

Release.prototype.create = function (callback) {
    delete this._id;
    db.insert('release_table', this, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        callback(null, result);
    });
};

Release.prototype.delete = function (callback) {
    db.deleteRow('release_table', { id: this._id }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Release.prototype.findById = function (callback) {
    db.find('release_table', { id: this._id }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Release.prototype.findByName = function (callback) {
    db.find('release_table', { name: this.name }, (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result);
    });
};

Release.prototype.findAll = function (callback) {
    db.findAll('release_table', (err, results, fields) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, results);
    });
};

module.exports = Release;