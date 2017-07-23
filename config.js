let config = {};

config.report = {};
config.database = {};
config.server = {};

config.report.passXpath ="//x:a[@title='Display all passed']";
config.report.failXpath = "//x:a[@title='Display all errors']";
config.report.skippedXpath = "//x:a[@title='Display all skipped test']";
config.report.summaryFile= "/reports/html/overview-summary.html";
config.report.indexFile="/reports/html/index.html";

config.database.host = process.env.DB_HOST || 'localhost';
config.database.port = process.env.DB_PORT || 3000;
config.database.username = process.env.DB_USERNAME || 'username';
config.database.password = process.env.DB_PASSWORD || 'password';
config.database.dbname = process.env.DB_NAME || 'reporting_db';

config.server.host = 'localhost';
config.server.port = 8080;

module.exports = config;
