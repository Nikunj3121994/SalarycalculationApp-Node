var apiRouter = require('express').Router();
var authRouter = require('express').Router();
var secureRouter = require('express').Router();

var DEMO_IDENTIFIER = '1234567890';

module.exports = function(options) {

	var routerObj = {};

	routerObj.apiRoutes = function (options) {
		var employer = require('./api/employer')(options);
		var employee = require('./api/employee')(options);
		var calculationRowType = require('./api/calculationRowType')(options);
		var calculation = require('./api/calculation')(options);
		var calculationRow = require('./api/calculationRow')(options);
		var user = require('./api/user')(options);

		console.log('performed configuration in api routes');

		//here we have a signed-on dummy account, do not check the 'unregistered' flag here.
		apiRouter.post('/register/:registrationType', function(req, res, next) { 
			if (!req.user) {
				console.log('not authenticated!');
				return res.redirect('/login.html');
			}

			user.save(req, res, next);
		});

		//for all the other requests we need a signed-on user that is registered, check the flag.
		apiRouter.use(function (req, res, next) {
			if (!req.user || req.user.unregistered) {
				res.status('401').write('calling the API requires authentication.');
				res.end();
				return;
			}

			next();
		});

		apiRouter.get('/employer', employer.load);
		apiRouter.post('/employer', employer.update);
		apiRouter.get('/employee/:employerId', employee.loadByEmployerId);
		apiRouter.get('/employee', employee.loadAll);
		apiRouter.post('/employee', employee.update);
		apiRouter.get('/calculationRowType', calculationRowType.loadAll);
		apiRouter.get('/calculation', calculation.loadByEmployerId);
		apiRouter.post('/calculation', calculation.save);
		apiRouter.get('/calculationRow/:calculationId', calculationRow.loadByCalculationId);

		return apiRouter;
	}

	routerObj.authenticationRoutes = function(options) {
		var passport = require('passport');
		var mongoose = require('mongoose');
		var userModel = mongoose.model('User');

		authRouter
		.get('/auth/google', function(req, res, next) {
			passport.authenticate('google', function(err) {
				if (err) {
					return res.redirect('/login.html');
				}

				next();
			}) (req, res, next);
		})
		.get('/auth/google/return', function(req, res, next){
			passport.authenticate('google', function(err, user, info){ 
				var redirectUrl = '/register.html';

				if (err) {
					console.log('tuli jokin virhe'); 
					return next(err); 
				}
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

			}) (req, res, next);
		})
		// .use(function(req, res, next) {
		// 	if (!req.user) {
		// 		console.log('not authenticated!');
		// 		return res.redirect('/login.html');
		// 	}

		// 	next();
		// })
		.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		})
		.get('/register.html', function(req, res){
			res.render('register', { 
				userdisplayName: req.user.displayName,
				profiles: {
					employer: req.user._employer,
					employee: req.user._employee
				}
			});
		})
		.get('/demologin', function(req, res, next) {
			
			userModel.findOne({ providerId: DEMO_IDENTIFIER }, function(err, user) {
				req.logIn(user, function(err){
					if (err) { return next(err); }

					res.redirect('register.html');
				});
			});
		})
		.post('/login/:registrationType', function(req, res, next) { 
			if (req.params.registrationType == 'employer') {
				res.redirect('/index.html');					
			}
			else {
				res.redirect('index_employee.html');
			}
		});

		return authRouter;
	}

	routerObj.secureRoutes = function(options) {
		secureRouter.use(function(req, res, next) {
			if (!req.user || req.user.unregistered) {
 				return res.redirect('/login.html');
			}

			next();
		})

		secureRouter.get('/index.html', function(req, res){
			res.render('index', { userdisplayName: req.user.displayName, isLoggedIn: true });
		})

		return secureRouter;
	}

	return routerObj;
}