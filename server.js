var mongoose = require('mongoose');
var connect = require('connect');
var express = require('express');
var routes = require('./lib/routes');
require('./lib/schemas')();
var systemInit = require('./lib/systemInit');

var app = express()
.use(connect.favicon())
.use(connect.logger('dev'))
.use('/api', routes())
.use(connect.static('public'));

mongoose.connect('mongodb://localhost/salarycalculationapp', function(err) {
	if (err) throw err;

	systemInit.initialize();

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