const createError = require("http-errors");
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

//CORS
const cors = require("cors");
const corsConfig = require("./config/config." + process.env.NODE_ENV).corsConfig;
app.use(cors({
  origin: (origin, cb) => {
    if(corsConfig.allow.indexOf(origin) !== -1 || corsConfig.allow.indexOf("*") !== -1) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed through CORS"));
    }
  }
}));

//remove if using reverse proxy as that will handle compression
const compression = require("compression");
app.use(compression());

app.use(express.static(path.join(__dirname, "client", "build")));

const httpLogger = require("./logging/httpLogger");
app.use(httpLogger.logger);
app.use(httpLogger.debugLogger);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const initDB = require('./db/init');
const createData = require("./db/create");
const createFTS = require("./db/fts");

initDB.init();

if(process.env.INIT_DATA) {
  createData.create();
  createFTS.fts();
}

const test = require("./routes/test.routes");
const users = require("./routes/user.routes");
const admin = require("./routes/admin.routes");
const auth = require("./routes/auth.routes");
const notification = require("./routes/notification.routes");
const courses = require("./routes/course.routes");
const posts = require("./routes/posts.routes");
const tags = require("./routes/tags.routes");
const search = require("./routes/search.routes");
const analysis = require("./routes/analysis.routes");

app.use("/test", test);
app.use("/users", users);
app.use("/admin", admin);
app.use("/auth", auth);
app.use("/notification", notification);
app.use("/courses", courses);
app.use("/posts", posts);
app.use("/tags", tags);
app.use("/search", search);
app.use("/analysis", analysis);

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
