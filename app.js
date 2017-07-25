'use strict';

//Core modules
let express = require('express')
let app = express();

//Custom modules
let db = require('./src/db');
const config = require('./config')

//routes
let page = require('./routes/page');
let api = require('./routes/api');

//Initialize Database - Errors out if DB is not found or problem creating Database
db.initDB();

//Set static assets
app.use(express.static('public'));

app.use('/', page);
app.use('/', api);

app.listen(config.server.port, config.server.host);