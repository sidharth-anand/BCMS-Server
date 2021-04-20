const { Pool } = require('pg');

const dbLogger = require("../logging/dbLogger");
const dbConfig = require("../config/config." + process.env.NODE_ENV).dbConfig;
const debug = require("debug")("BCMS:db");
const verboseDebug = require("debug")("BCMS:db-verbose");

const fs = require('fs');

if(process.env.NODE_ENV != 'dev') {
    dbConfig.connectionString = process.env.DATABASE_URL;
}

const pool = new Pool(dbConfig);

async function query(text, params, callback) {
    const start = Date.now();

    const query = pool.query(text, params);
    try {
        query
        .then(res => {
            const duration = Date.now() - start;
            dbLogger.info('executed query', { text, duration, rows: res.rowCount });
            debug('executed query: ' + (text.includes('\n') ? text.split('\n')[0].slice(0, 35) : text + " " + duration)); 
            verboseDebug('exectued query: ' + text + " " + duration);
    
            if(callback) {
                callback(null, res);
            }
        })
        .catch(err => {
            const duration = Date.now() - start;
            dbLogger.error('error executing query', { text, duration });
            debug("error executing query: " + text + " " + duration);
    
            if(callback) {
                callback(err, null);
            }
        });
    } catch(e) {
        callback(e, null);
    }

    return query;
};

async function processFile(filename, params, callback) {
    return new Promise(resolve => {
        fs.readFile(filename, "utf8", (err, data) => {
            if(!err) {
                debug("processed file: " + filename);
                query(data, params, resolve);
            } else {
                debug("Error processing file: " + filename + ". Skipping file...");
                resolve();
            }
        });
    });
}

async function processFileSequence(filenames) {
    for(let i = 0; i < filenames.length; i++) {
        await processFile(filenames[i], []);
    }
}

async function getClient(callback) {
    return pool.connect((err, client, done) => {
        const query = client.query
        // monkey patch the query method to keep track of the last query executed
        client.query = (...args) => {
            client.lastQuery = args
            return query.apply(client, args)
        }
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            dbLogger.error('A client has been checked out for more than 5 seconds!')
            dbLogger.error(`The last executed query on this client was: ${client.lastQuery}`)
        }, 5000)

        const release = (err) => {
            // call the actual 'done' method, returning this client to the pool
            done(err)
            // clear our timeout
            clearTimeout(timeout)
            // set the query method back to its old un-monkey-patched version
            client.query = query
        }

        callback(err, client, release);
    });
}

module.exports = {
    query,
    processFile,
    processFileSequence,
    getClient,
}
