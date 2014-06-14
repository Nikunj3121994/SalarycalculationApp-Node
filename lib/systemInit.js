var mongoose = require('mongoose');
var CalculationRowType = mongoose.model('CalculationRowType');
var calculationModel = mongoose.model('Calculation');
var calculationRowModel = mongoose.model('CalculationRow');

module.exports.initialize = function () {

	//quick exit, disable when initialization is required.
	return;

	// calculationModel.remove(function(err) {
	// 	if (err) throw err;
	// });
	// calculationRowModel.remove(function(err) {
	// 	if (err) throw err;
	// });

	//TODO: Because these parameters are recreated we should be linking calculation rows to code property instead of the id.

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