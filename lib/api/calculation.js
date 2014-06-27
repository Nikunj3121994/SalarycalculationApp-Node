var mongoose = require('mongoose');
var calculationModel = mongoose.model('Calculation');
var calculationRowModel = mongoose.model('CalculationRow');

module.exports = function(options) {

	//options is not used for anything right now.

	var calculation = {};

	calculation.loadByEmployerId = function(req, res, next) {

		calculationModel.find({ _employer: req.user._employer }, function (err, results) {
			if (err) throw err;

			console.log(results);

			res.write(JSON.stringify(results));
			res.end();
		});
	}

	calculation.save = function (req, res, next) {

		req.setEncoding('utf8');
		
		var obj = req.body;
		var newCalculation = new calculationModel( {
			_employer: req.user._employer,
			periodStart: new Date(obj.basicData.PeriodStartDate),
			periodEnd: new Date(obj.basicData.PeriodEndDate),
			status: "submitted",
			employees: obj.selectedEmployees.map(function(elem) { return elem._id; })
		});

		newCalculation.save(function(err, savedCalculation) {
			if (err) return console.error(err);

			var rowsToCreate = [];

			for (var i = obj.calculationRows.length - 1; i >= 0; i--) {

				var newRow = new calculationRowModel({
					_calculationRowType: obj.calculationRows[i].typeId,
					_calculation: savedCalculation._id,
					value: obj.calculationRows[i].value
				});

				rowsToCreate.push(newRow);
			};

			calculationRowModel.create(rowsToCreate, function(err) {
				if (err) return console.error(err);
			});
		});
	}

	return calculation;
}