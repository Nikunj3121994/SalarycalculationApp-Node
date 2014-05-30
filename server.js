//This file decreased in size quite considerably after switching to Connect :)

var api = require('./lib/api');
var mongoose = require('mongoose');
var connect = require('connect');

var app = connect()
	.use(connect.favicon())
	.use(connect.logger('dev'))
	.use('/api', api())
	.use(connect.static('public'));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

app.listen(3000);