var mongoose = require('mongoose');
var passport = require('passport'), GoogleStrategy = require('passport-google').Strategy;
var CalculationRowType = mongoose.model('CalculationRowType');
var calculationModel = mongoose.model('Calculation');
var calculationRowModel = mongoose.model('CalculationRow');
var userModel = mongoose.model('User');

module.exports.initialize = function (options) {

	passport.use(new GoogleStrategy({
		returnURL: options.baseUrl + '/auth/google/return',
		realm: options.baseUrl
	},
	function(identifier, profile, done) {

		console.log('identifier ' + identifier);
		console.log('profile dname' + profile.displayName);

		userModel.findOne({ providerId: identifier }, function(err, user) {
			if (err)
			{
				console.log('error in getting user from db ' + err);
				return done(err);
			}

			if (!user)
			{
				var user = {};
				user.unregistered = true;
				user.providerId = identifier;
				user.displayName = profile.displayName;

				console.log('redirecting to inputting own data ' + user);
				return done(null, user);
			}

			done(null, user);
		});
	}
	));

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				console.log('key ' + key + ', ' + obj[key]);
			}
		}

		done(null, obj);
	});

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