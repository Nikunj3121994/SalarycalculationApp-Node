var url = require('url');

exports.serve = function(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log(parsedUrl);

	var splitUrl = req.url.split('/');
	console.log(splitUrl);

	var entity = splitUrl[1] + '/' + splitUrl[2];
	console.log("entity:" + entity);

	if (entity == 'api/Employer') {
		switch (req.method) {
			case 'GET':
				res.write('{"EmployerId":null,"Name":"Mikko","Phone":"0403446563","Employees":[{"EmployeeId":"68b3dcad-d5bb-4a9a-8928-904418c09d40","Name":"Kalle","Phone":"1234567","Email":"kalle@kalle.com","EmployerId":null,"Employer":null,"Taxcards":[]},{"EmployeeId":"781d3520-11a8-46ae-b7f2-cabd7dbbb5df","Name":"Saana","Phone":"55422342","Email":"saana@saana.com","EmployerId":null,"Employer":null,"Taxcards":[]},{"EmployeeId":"57bed8a4-9dcd-48c6-9a51-f9467a93f39f","Name":"Ville","Phone":"21414124","Email":"ville@ville.com","EmployerId":null,"Employer":null,"Taxcards":[]}]}');
				res.end();
				break;
		}
	}
	else if (entity == 'api/Employee') {
		switch (req.method) {
			case 'GET':				
				if ('string' === typeof parsedUrl.query) {
					res.write('{"EmployeeId":"' + parsedUrl.query + '","Name":"Mikko","Phone":"0403446563","Email":null,"EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"1","TaxPercentage":24.0,"EmployeeId":null,"Employee":null},{"TaxcardId":"2","TaxPercentage":19.0,"EmployeeId":null,"Employee":null},{"TaxcardId":"3","TaxPercentage":30.0,"EmployeeId":null,"Employee":null}]}');
					res.end();
					break;
				} else {
					res.write('[{"EmployeeId":"a34fba89-6b5c-40e4-8cbc-3168a5f5d3e7","Name":"Kalle","Phone":"1234567","Email":"kalle@kalle.com","EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"8a5a48a1-e27f-4cab-988f-250f9437caf6","TaxPercentage":25.0,"EmployeeId":null,"Employee":null}]},{"EmployeeId":"af8ecf4f-d01b-4b36-93b0-754cea709584","Name":"Saana","Phone":"55422342","Email":"saana@saana.com","EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"5aaeead2-5a05-4797-b1ba-64322bc51206","TaxPercentage":20.0,"EmployeeId":null,"Employee":null}]},{"EmployeeId":"a6bee8e7-99db-47f2-86e3-dea5638abd3a","Name":"Ville","Phone":"21414124","Email":"ville@ville.com","EmployerId":null,"Employer":null,"Taxcards":[{"TaxcardId":"2e7ea01f-c879-4afe-8b24-93aa9adbe637","TaxPercentage":18.5,"EmployeeId":null,"Employee":null}]}]');
					res.end();
					break;
				}
		}	
	}


}