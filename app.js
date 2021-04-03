﻿const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const config = require("./config/config." + process.env.NODE_ENV).serverConfig;

const app = express();

if (config.behindHttps) {
  app.use(function (req, res, next) {
    if (!req.secure && req.get("X-Forwarded-Proto") !== "https") {
      res.redirect("https://" + req.get("Host") + req.url);
    } else next();
  });
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//remove if using reverse proxy as that will handle compression
const compression = require("compression"); 
app.use(compression());

app.use(express.static(path.join(__dirname, "client", "build")));

const httpLogger = require("./logging/httpLogger");
app.use(httpLogger.logger);
app.use(httpLogger.debugLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const initDB = require('./db/init');
initDB.init();

const test = require("./routes/test.routes");
const users = require("./routes/user.routes");
const admin = require("./routes/admin.routes");
const notification = require("./routes/notification.routes");

app.use("/test", test);
app.use("/users", users);
app.use("/admin", admin);
app.use("/notification", notification);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
