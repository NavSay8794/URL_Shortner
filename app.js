var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard')
const shortRouter = require('./routes/shotrenUrl')
const redirectRouter = require('./routes/redirect')

var app = express();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/shortner' , shortRouter)
app.use('/sul.go', redirectRouter)

module.exports = app;
