var mongoose = require('mongoose');
var calculationRowModel = mongoose.model('CalculationRow');

module.exports = function(options) {

	//options is not used for anything right now.

	var calculationRow = {};

	calculationRow.loadByCalculationId = function(req, res, next) {

		calculationRowModel.find({ _calculation: req.params.calculationId}, function (err, results) {
			if (err) throw err;

			console.log(results);

			res.write(JSON.stringify(results));
			res.end();
		});
	}

	return calculationRow;
}