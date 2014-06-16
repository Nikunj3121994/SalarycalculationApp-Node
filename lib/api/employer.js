var mongoose = require('mongoose');
var Employer = mongoose.model('Employer');

module.exports = function(options) {

	//options is not used for anything right now.

	console.log('performed configuration in employer');

	var employer = {};

	employer.load = function(req, res, next) {

		Employer.find(function (err, results) {
			if (err) throw err;

			if (results.length == 1)
			{
				var emp = results[0];

				console.log(emp);

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

		var item = '';
		req.setEncoding('utf8');
		req.on('data', function(chunk) {
			item += chunk;
		});
		req.on('end', function() {
			var obj = JSON.parse(item);
			var empModel = mongoose.model('Employer');

			var id = obj._id;
			delete obj._id;
			empModel.update({_id: id}, obj, {upsert: true}, function (err) {
				if (err) throw err;

				console.log('updated');
				res.end('all ok');
			});
		});
	}

	return employer;
}