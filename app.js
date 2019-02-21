let createError   = require('http-errors'),
    express       = require('express'),
    cookieParser  = require('cookie-parser'),
    env           = require('dotenv').load(),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    pe            = require('parse-error'),
    cors          = require('cors'),
    logger        = require('morgan');

let app = express();

const CONFIG = require('./config/config');

//app.set('secretKey', process.env.TOKEN_SECRET_KEY);    // jwt secret token

// For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Passport
app.use(passport.initialize());

// Database
const models = require("./models");

// CORS
app.use(cors());

/**
 * Routes
 */

// The main page
app.get('/', function(req, res) {
  res.statusCode = 200;
  res.json({
    status: "success",
    message: "Kahoot API !!",
  });
});

let users = require('./routes/users');

app.use('/api', users);
/**
 * Routes END
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  let errorMessage = {};
  errorMessage.message = err.message;
  errorMessage.error = req.app.get('env') === 'development' ? err : {};

  errorMessage.status = err.status || 500;

  res.json(errorMessage);
});

module.exports = app;