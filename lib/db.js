'use strict;'

let mysql = require('mysql');
let config = require('../config')

const DB_CREATE = `CREATE DATABASE IF NOT EXISTS ${config.database.dbname};`;
const TABLE_CREATE = 'CREATE TABLE IF NOT EXISTS reports (id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (ID), project VARCHAR(255), releasename VARCHAR(255), date DATETIME, passcount INT, failcount INT, skippedcount INT, reportpath VARCHAR(255))'
let INSERT_QUERY = 'INSERT INTO reports SET ?';
let SELECT_QUERY = 'SELECT * FROM reports WHERE ?';
let SELECT_ALL_QUERY = 'SELECT * FROM reports';

let connection = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.dbname
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
        if (err){
            console.error("Error creating DB");
            throw new Error(err);
        }

        connection.connect((err) => {
            if (err) {
                console.error("Error Connecting to MySQL DB instance")
                throw new Error(err);
            }

            console.info('Connected to the MySQL DB');
            connection.query(TABLE_CREATE, (err) => {
                if (err) {
                    console.error("Error Creating Table in Database")
                    throw new Error(err);
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
        if(err)
            throw new Error(err);

        pre_connection.query(DB_CREATE, (err, result) => {
            if (err)
                throw new Error(err);

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
function insert(sqlObject, callback) {
    let query = connection.query(INSERT_QUERY, sqlObject, (error, results, fields) => {
        if (error){
            callback(error);
            return;
        }

        callback(null, results, fields);
    });
}

/*
Find queried data from database
*/
function find(sqlObject, callback) {
    let query = connection.query(SELECT_QUERY, sqlObject, (error, results, fields) => {
        console.log(query.sql)
        if (error){
            callback(error);
            return;
        }

        callback(null, results);
    });
}

function findAll(sqlObject, callback) {
    let query = connection.query(SELECT_ALL_QUERY, sqlObject, (error, results, fields) => {
        if (error){
            callback(error);
            return;
        }

        callback(null, results);
    });
}

module.exports = {
    initDB,
    insert,
    find,
    findAll
}