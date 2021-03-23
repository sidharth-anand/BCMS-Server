const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const debug = require("debug")("BCMS:http");

const config = require('../config/config.' + process.env.NODE_ENV);
const logConfig = config.logConfig.httpLog;
const logDirectory = path.join(__dirname + "/..", 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const options = logConfig.rfsOptions;
options.path = logDirectory;
const logStream = rfs.createStream(logConfig.fname, options);

const logger = morgan(logConfig.format, {stream:logStream});
const debugLogger = morgan(logConfig.format, {stream: {write: msg => debug(msg)}});

module.exports = {logger, debugLogger};