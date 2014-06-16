var mongoose = require('mongoose');

module.exports = function(options) {

	//options is not used for anything right now.

	var calculationRowType = {};

	calculationRowType.loadAll = function(req, res, next) {

		var RowType = mongoose.model('CalculationRowType');

		RowType.find({ }, function (err, results) {
			res.write(JSON.stringify(results));
			res.end();
		});
	}

	return calculationRowType;
}