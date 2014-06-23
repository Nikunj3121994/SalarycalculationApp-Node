var options = {
	baseUrl: 'http://localhost:3000'
}

var mongoose = require('mongoose');
var connect = require('connect');
var express = require('express');
var routes = require('./lib/routes');
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
.get('/auth/google', passport.authenticate('google'))
.get('/auth/google/return', function(req, res, next){
	passport.authenticate('google', function(err, user, info){ 
		var redirectUrl = '/index.html';

		if (err) { return next(err); }
		if (user.unregistered) {
			req.logIn(user, function(err){
				if (err) { return next(err); }
			});

			return res.redirect('/register.html'); 
		}

		req.logIn(user, function(err){
			if (err) { return next(err); }
		});
		res.redirect(redirectUrl);
	})(req, res, next);
})
.use('/api', routes())
.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
})
.use(connect.static('public')) //use the same mounting point ('/') here and in the next connect.static call, but authenticate the latter one with the next middleware function.
.use(function(req, res, next) {
	if (!req.user || req.user.unregistered) {
		console.log('not authenticated!');
		return res.redirect('/login.html'); //This actually loads the index html with the login partial.
	}
	console.log('is authenticated, ' + req.user.displayName);

	next();
})
.get('/index.html', function(req, res){
	console.log('renderöidään näkymä, ' + req.user.displayName);
	res.render('index', { userdisplayName: req.user.displayName, isLoggedIn: true });
})
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