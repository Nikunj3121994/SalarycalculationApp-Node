exports.serve = function(req, res) {
	if (req.url == '/api/Employer') {
		switch (req.method) {
			case 'GET':
				res.write('{"EmployerId":null,"Name":"Mikko","Phone":"0403446563","Employees":[{"EmployeeId":"68b3dcad-d5bb-4a9a-8928-904418c09d40","Name":"Kalle","Phone":"1234567","Email":"kalle@kalle.com","EmployerId":null,"Employer":null,"Taxcards":[]},{"EmployeeId":"781d3520-11a8-46ae-b7f2-cabd7dbbb5df","Name":"Saana","Phone":"55422342","Email":"saana@saana.com","EmployerId":null,"Employer":null,"Taxcards":[]},{"EmployeeId":"57bed8a4-9dcd-48c6-9a51-f9467a93f39f","Name":"Ville","Phone":"21414124","Email":"ville@ville.com","EmployerId":null,"Employer":null,"Taxcards":[]}]}');
				res.end();
				break;
		}

	}

}