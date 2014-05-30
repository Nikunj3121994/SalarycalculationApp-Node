var url = require('url');
var mongoose = require('mongoose');
require('./schema/employer.js')();
var utils = require('./myUtils')

var Employer = mongoose.model('Employer');

mongoose.connect('mongodb://localhost/salarycalculationapp', function(err) {
	if (err) throw err;

// 	Employer.remove(function(err) {
// 		if (err) throw err;

// 		// Employer.create({
// 		// 	name: "Mikko",
// 		// 	phone: "0403446536"
// 		// });
// });

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
						delete obj.employees;
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
		else if (parsedUrl.pathname == '/Employee/') {
			switch (req.method) {
				case 'GET':				
				{
					if ('string' === typeof parsedUrl.query) {
						var Employee = mongoose.model('Employee');

						console.log('get employees: ' + parsedUrl.query);

						var Employee = mongoose.model('Employee');

						Employee.find({ _employer: parsedUrl.query }, function (err, employees) {
							console.log('löytyi jotain' + employees[0]);

							res.write(JSON.stringify(employees));
							res.end();
						});

						break;
					}
					else {
						res.write('[{"EmployeeId":"a34fba89-6b5c-40e4-8cbc-3168a5f5d3e7","Name":"Kalle","Phone":"1234567","Email":"kalle@kalle.com","EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"8a5a48a1-e27f-4cab-988f-250f9437caf6","TaxPercentage":25.0,"EmployeeId":null,"Employee":null}]},{"EmployeeId":"af8ecf4f-d01b-4b36-93b0-754cea709584","Name":"Saana","Phone":"55422342","Email":"saana@saana.com","EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"5aaeead2-5a05-4797-b1ba-64322bc51206","TaxPercentage":20.0,"EmployeeId":null,"Employee":null}]},{"EmployeeId":"a6bee8e7-99db-47f2-86e3-dea5638abd3a","Name":"Ville","Phone":"21414124","Email":"ville@ville.com","EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"2e7ea01f-c879-4afe-8b24-93aa9adbe637","TaxPercentage":18.5,"EmployeeId":null,"Employee":null}]}]');
						res.end();
						break;
					}
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
						var empModel = mongoose.model('Employee');
						var empObj = new empModel(obj);

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
		else if (parsedUrl.pathname == '/CalculationRowType/') {
			switch (req.method) {
				case 'GET':
				res.write('[{"Id":"1c567b31-9458-4792-9c97-3a9a94f620ff","Name":"Eating at company restaurant","RowType":"minus"},{"Id":"dbf78397-5c21-4b79-a06b-1f53665db354","Name":"Gross salary","RowType":"plus"},{"Id":"333ebb19-a65d-40d7-8197-41d154dccd63","Name":"Vacation compensation","RowType":"plus"}]');
				res.end();			
				break;
			}	
		}
		else {
			console.log('not found');
			utils.send404(res);
		}
	}
}