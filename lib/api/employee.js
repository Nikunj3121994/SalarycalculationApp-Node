var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');

module.exports = function(options) {

	//options is not used for anything right now.

	var employee = {};

	employee.loadAll = function(req, res, next) {
		Employee.find(function (err, results) {
			if (err) throw err;

			res.write(JSON.stringify(results));
			res.end();		
		});
	}

	employee.loadByEmployerId = function(req, res, next) {

		var Employee = mongoose.model('Employee');

		Employee.find({ _employer: req.params.employerId }, function (err, employees) {
			res.write(JSON.stringify(employees));
			res.end();
		});
	}

	employee.update = function (req, res, next) {

		var item = '';
		req.setEncoding('utf8');
		req.on('data', function(chunk) {
			item += chunk;
		});
		req.on('end', function() {
			var obj = JSON.parse(item);
			var empModel = mongoose.model('Employee');
			var empObj = new empModel(obj);

			var id = obj._id === undefined ? new mongoose.Types.ObjectId() : obj._id;
			console.log(obj);
			console.log("obj._id on " + obj._id + ", valittu id on " + id);
			delete obj._id;
			empModel.update({_id: id}, obj, {upsert: true}, function (err) {
				if (err) throw err;

				console.log('updated');
				res.end('all ok');
			});
		});
	}

	return employee;
}