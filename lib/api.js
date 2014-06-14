var url = require('url');
require('./schemas')();
var systemInit = require('./systemInit');
var mongoose = require('mongoose');
var utils = require('./myUtils')

var Employer = mongoose.model('Employer');
var CalculationRowType = mongoose.model('CalculationRowType');
var calculationModel = mongoose.model('Calculation');
var calculationRowModel = mongoose.model('CalculationRow');

mongoose.connect('mongodb://localhost/salarycalculationapp', function(err) {
	if (err) throw err;

	systemInit.initialize();

	console.log('connection made');
});

module.exports = function(options) {

	//options is not used for anything right now.

	return function(req, res, next) {

		var parsedUrl = url.parse(req.url);
		console.log(parsedUrl);

		if (parsedUrl.pathname == '/Employer') {
			switch (req.method) {
				case 'GET':
				{
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
					break; 
				}
				case 'POST':
				{
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

					break;
				}
			}
		} 
		else if (parsedUrl.pathname == '/Taxcard/') {
			switch (req.method) {
				case 'GET':
				res.write('{"TaxcardId":"1","TaxPercentage":34.0,"EmployeeId":null,"Employee":null}');
				res.end();			
				break;
			}
		}
		else if (parsedUrl.pathname == '/Calculation') {
			switch (req.method) {				
				case 'POST':
				{
					var item = '';
					req.setEncoding('utf8');
					req.on('data', function(chunk) {
						item += chunk;
					});
					req.on('end', function() {
						var obj = JSON.parse(item);
						var newCalculation = new calculationModel( {
							_employee: "5388937bc78bc6a025d9ee63",
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

							console.log('rivejä: ' + rowsToCreate.length);

							calculationRowModel.create(rowsToCreate, function(err) {
								if (err) return console.error(err);

								res.end('all ok');
							});
						});

					});

					break;
				}
				case 'GET':
				{
					calculationModel.find(function (err, results) {
						if (err) throw err;

						console.log(results);

						res.write(JSON.stringify(results));
						res.end();
					});
					break;
				}
			}
		}
		else if (parsedUrl.pathname == '/CalculationRow/') {
			switch (req.method) {				

				case 'GET':
				{
					if ('string' === typeof parsedUrl.query) {
						calculationRowModel.find({ _calculation: parsedUrl.query}, function (err, results) {
							if (err) throw err;

							console.log(results);

							res.write(JSON.stringify(results));
							res.end();
						});
						break;
					}
				}
			}
		}
		else if (parsedUrl.pathname == '/Employee/') {
			switch (req.method) {
				case 'GET':				
				{
					if ('string' === typeof parsedUrl.query) {
						var Employee = mongoose.model('Employee');

						console.log('get employees: ' + parsedUrl.query);

						Employee.find({ _employer: parsedUrl.query }, function (err, employees) {
							res.write(JSON.stringify(employees));
							res.end();
						});

						break;
					}
					else 
					{
						//TODO: I should be getting the current employer from session here. This just basically "returns all employees for any employer".
						var Employee = mongoose.model('Employee');

						console.log('get employees: ' + parsedUrl.query);

						Employee.find({ }, function (err, employees) {
							res.write(JSON.stringify(employees));
							res.end();
						});

						break;
					}
				}
				case 'POST': 
				{
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

					break;
				}
			}
		}
		else if (parsedUrl.pathname == '/CalculationRowType/') {
			switch (req.method) {
				case 'GET': {
					var RowType = mongoose.model('CalculationRowType');

					RowType.find({ }, function (err, results) {
						res.write(JSON.stringify(results));
						res.end();
					});

					break;
				}
			}	
		}
		else {
			console.log('not found');
			utils.send404(res);
		}
	}
}