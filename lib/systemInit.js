var mongoose = require('mongoose');
var CalculationRowType = mongoose.model('CalculationRowType');

module.exports.initialize = function () {

	CalculationRowType.remove(function(err) {
		CalculationRowType.create({
			rowType: 'plus',
			code: 'grossSalary',
			friendlynames: [
			{ lang: 'fi', friendlyName: 'Bruttopalkka' },
			{ lang: 'en', friendlyName: 'Gross salary' }
			]
		});
		CalculationRowType.create({
			rowType: 'plus',
			code: 'vacationComp',
			friendlynames: [
			{ lang: 'fi', friendlyName: 'Lomakorvaus' },
			{ lang: 'en', friendlyName: 'Vacation compensation' }
			]
		});
		CalculationRowType.create({
			rowType: 'minus',
			code: 'companyRestaurant',
			friendlynames: [
			{ lang: 'fi', friendlyName: 'Työpaikan ruokala' },
			{ lang: 'en', friendlyName: 'Company restaurant' }
			]
		});
	});
}