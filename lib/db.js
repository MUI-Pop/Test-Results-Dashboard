'use strict;'

let mysql = require('mysql');
let config = require('../config')

const DB_CREATE = `CREATE DATABASE IF NOT EXISTS ${config.database.dbname};`;
const SETTINGS_TABLE_CREATE = 'CREATE TABLE IF NOT EXISTS report_settings (id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (ID), name VARCHAR(255) NOT NULL, passXpath VARCHAR(255) NOT NULL, failXpath VARCHAR(255) NOT NULL, skippedXpath VARCHAR(255), summaryFile VARCHAR(255) NOT NULL, indexFile VARCHAR(255) NOT NULL, UNIQUE(name))'
const RELEASE_TABLE_CREATE = 'CREATE TABLE IF NOT EXISTS release_table (id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (ID), name VARCHAR(255) NOT NULL, UNIQUE(name))'
const PROJECT_TABLE_CREATE = 'CREATE TABLE IF NOT EXISTS project_table (id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (ID), name VARCHAR(255) NOT NULL, release_id int NOT NULL, FOREIGN KEY (release_id) REFERENCES release_table(id), constraint UQ_consrtaint unique(name, release_id))';
const REPORTS_TABLE_CREATE = 'CREATE TABLE IF NOT EXISTS reports (id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (ID), project_id int NOT NULL, date DATETIME, passcount INT, failcount INT, skippedcount INT, reportpath VARCHAR(255), FOREIGN KEY (project_id) REFERENCES project_table(id))';

//Common queries
const INSERT_QUERY_TEMPLATE = 'INSERT INTO ?? SET ?';
const SELECT_QUERY_TEMPLATE = 'SELECT * FROM ?? WHERE ?';
const SELECT_ALL_QUERY_TEMPLATE = 'SELECT * FROM ??';
const DELETE_QUERY_TEMPLATE = 'DELETE FROM ?? WHERE ?';

let connection = mysql.createPool({
    connectionLimit : 10,
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.dbname,
    multipleStatements: true
});

//Eg sqlObject
/* let post  = {
    Project: 'IOS',
    ReleaseName: 'ARelease',
    Date: (new Date()).toISOString().substring(0, 19).replace('T', ' '),
    PassCount: 1,
    FailCount: 5,
    SkippedCount: 4,
    ReportPath: __dirname + '/public/index.html'
}; */

/*
Initialize MySQL DB with Database and Table, will create if doesn't exist
*/
function initDB() {
    createDB((err, result) => {
        if (err) {
            console.error("Error creating DB");
            throw err;
        }

        connection.getConnection((err) => {
            if (err) {
                console.error("Error Connecting to MySQL DB instance")
                throw err;
            }

            console.info('Connected to the MySQL DB');
            connection.query(`${SETTINGS_TABLE_CREATE}; ${RELEASE_TABLE_CREATE}; ${PROJECT_TABLE_CREATE}; ${REPORTS_TABLE_CREATE};`, (err) => {
                if (err) {
                    console.error("Error Creating Table in Database")
                    throw err;
                }

            })
        });
    })
}

/*
Create DB if doesn't exist
*/
function createDB(callback) {
    let pre_connection = mysql.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.username,
        password: config.database.password
    });

    pre_connection.connect((err) => {
        if (err)
            throw err;

        pre_connection.query(DB_CREATE, (err, result) => {
            if (err)
                throw err;

            pre_connection.end((err) => {
                if (err)
                    callback(err);

                callback(null, result);
            });
        })
    })
}


/*
Insert specified sqlObject to table
*/
function insert(table, sqlObject, callback) {
    let query = connection.query(INSERT_QUERY_TEMPLATE, [table, sqlObject], (error, results, fields) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, results, fields);
    });
}

/*
Find queried data from database
*/
function find(table, sqlObject, callback) {
    let query = connection.query(SELECT_QUERY_TEMPLATE, [table, sqlObject], (error, results, fields) => {
        console.log(query.sql)
        if (error) {
            callback(error);
            return;
        }

        callback(null, results);
    });
}

function findAll(table, callback) {
    let query = connection.query(SELECT_ALL_QUERY_TEMPLATE, [table], (error, results, fields) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, results);
    });
}

function deleteRow(table, sqlObject, callback) {
    let query = connection.query(DELETE_QUERY_TEMPLATE, [table, sqlObject], (error, results, fields) => {
        console.log(query.sql)
        if (error) {
            callback(error);
            return;
        }

        callback(null, results);
    });
}

module.exports = {
    connection,
    initDB,
    insert,
    find,
    findAll,
    deleteRow
}