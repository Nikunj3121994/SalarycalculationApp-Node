var router = require('express').Router();
var passport = require('passport');

module.exports = function(options) {

	var employer = require('./api/employer')(options);
	var employee = require('./api/employee')(options);
	var calculationRowType = require('./api/calculationRowType')(options);
	var calculation = require('./api/calculation')(options);
	var calculationRow = require('./api/calculationRow')(options);
	var user = require('./api/user')(options);

	console.log('performed configuration in routes');

	//here we have a signed-on dummy account, do not check the 'unregistered' flag here.
	router.post('/register', function(req, res, next) { 
		if (!req.user) {
			console.log('not authenticated!');
			return res.redirect('/login.html');
		}

		user.save(req, res, next);
	});

	//for all the other requests we need a signed-on user that is registered, check the flag.
	router.use(function (req, res, next) {
		if (!req.user || req.user.unregistered) {
			res.status('401').write('calling the API requires authentication.');
			res.end();
			return;
		}

		next();
	});

	router.get('/employer', employer.load);
	router.post('/employer', employer.update);
	router.get('/employee/:employerId', employee.loadByEmployerId);
	router.get('/employee', employee.loadAll);
	router.post('/employee', employee.update);
	router.get('/calculationRowType', calculationRowType.loadAll);
	router.get('/calculation', calculation.loadByEmployerId);
	router.post('/calculation', calculation.save);
	router.get('/calculationRow/:calculationId', calculationRow.loadByCalculationId);

	return router;
}