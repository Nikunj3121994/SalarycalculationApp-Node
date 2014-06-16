var router = require('express').Router();

module.exports = function(options) {

	var employer = require('./api/employer')(options);
	var employee = require('./api/employee')(options);
	var calculationRowType = require('./api/calculationRowType')(options);
	var calculation = require('./api/calculation')(options);
	var calculationRow = require('./api/calculationRow')(options);

	console.log('performed configuration in routes');

	router.get('/employer', employer.load);
	router.post('/employer', employer.update);
	router.get('/employee/:employerId', employee.loadByEmployerId);
	router.get('/employee', employee.loadAll);
	router.post('/employee', employee.update);
	router.get('/calculationRowType', calculationRowType.loadAll);
	router.get('/calculation/:employerId', calculation.loadByEmployerId);
	router.post('/calculation', calculation.save);
	router.get('/calculationRow/:calculationId', calculationRow.loadByCalculationId);

	return router;
}