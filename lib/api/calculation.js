var mongoose = require('mongoose');
var calculationModel = mongoose.model('Calculation');
var calculationRowModel = mongoose.model('CalculationRow');

module.exports = function(options) {

	//options is not used for anything right now.

	var calculation = {};

	calculation.calculate = function(req, res, next) {
		req.setEncoding('utf8');

		var calculationData = req.body;

		console.log(calculationData);

		result = 'no result';

		if (calculationData.calculationRows.length > 0 && calculationData.employees.length > 0)
		{
			var totalTaxable = calculationData.calculationRows.reduce(function(prev, curr) {
				return prev + (curr.rowType == 'plus' ? curr.value : (curr.value * -1))
			}, 0);

			result = [];

			for (var i = calculationData.employees.length - 1; i >= 0; i--) {
				var employee = calculationData.employees[i];

				var calculationTotal = {};

				calculationTotal.employeeName = employee.name;
				calculationTotal.taxPercentage = employee.taxPercentage;
				calculationTotal.totalTaxable = totalTaxable;

				calculationTotal.totalTax = (employee.taxPercentage * totalTaxable) / 100;
				calculationTotal.totalPayable = calculationTotal.totalTaxable - calculationTotal.totalTax; 

				result.push(calculationTotal);
			};
		}
		
		res.write(JSON.stringify(result));
		res.end();
	}

	calculation.loadByEmployerId = function(req, res, next) {

		calculationModel.find({ _employer: req.user._employer }, function (err, results) {
			if (err) throw err;

			console.log(results);

			res.write(JSON.stringify(results));
			res.end();
		});
	}

	calculation.cancel = function (req, res, next) {
		req.setEncoding('utf8');
		
		calculationModel.update({ _id: req.params.calculationId }, { status:  'cancelled' }, function(err) {
			if (err) return console.error(err);

			res.write('calculation cancelled succesfully');
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