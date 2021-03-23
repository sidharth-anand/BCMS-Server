const bunyan = require('bunyan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const config = require('../config/config.' + process.env.NODE_ENV);
const logConfig = config.logConfig.dbLog;
const logDirectory = path.join(__dirname + "/..", 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const stream = logConfig.streamConfig;
stream.path = path.join(logDirectory, logConfig.streamConfig.fname);

const logger = bunyan.createLogger({
    name: 'dbLogger',
    serializers: bunyan.stdSerializers,
    streams: [stream]
});

module.exports = logger;