var mongoose = require('mongoose');
var Employer = mongoose.model('Employer');

module.exports = function(options) {

	//options is not used for anything right now.

	var employer = {};

	employer.load = function(req, res, next) {

		Employer.find(function (err, results) {
			if (err) throw err;

			if (results.length == 1)
			{
				var emp = results[0];

				res.write(JSON.stringify(emp));
				res.end();
			}
			else
			{
				res.end(JSON.stringify(new Employer()));
			}
		});

	}

	employer.update = function (req, res, next) {

		req.setEncoding('utf8');

		var obj = req.body;
		var empModel = mongoose.model('Employer');

		var id = obj._id;
		delete obj._id;
		delete obj.employees;
		empModel.update({_id: id}, obj, {upsert: true}, function (err) {
			if (err) throw err;
		});
	}

	return employer;
}