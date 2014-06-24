var options = {
	baseUrl: 'http://localhost:3000'
}

var mongoose = require('mongoose');
var connect = require('connect');
var express = require('express');
var routes = require('./lib/routes')();
require('./lib/schemas')();
var systemInit = require('./lib/systemInit');
var passport = require('passport');

var app = express()
.use(connect.favicon())
.use(connect.logger('dev'))
.use(connect.cookieParser())
.use(connect.session({secret: '1234567890QWERTY'}))
.use(passport.initialize())
.use(passport.session())
.use('/api', routes.apiRoutes())
.use(routes.authenticationRoutes())
.use(connect.static('public')) //use the same mounting point ('/') here and in the next connect.static call, but authenticate the latter one with the next express router configuration.
.use(routes.secureRoutes())
.use(connect.static('public/secure'))
.set('views', __dirname + '/public/secure')
.set('view engine', 'html')
.engine('html', require('ejs').renderFile);

mongoose.connect('mongodb://localhost/salarycalculationapp', function(err) {
	if (err) throw err;

	systemInit.initialize(options);

	console.log('connection made');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected on app termination');
		process.exit(0);
	});
});

app.listen(3000);