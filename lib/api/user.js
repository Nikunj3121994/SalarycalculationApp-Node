var mongoose = require('mongoose');
var User = mongoose.model('User');
var Employee = mongoose.model('Employee');

module.exports = function(options) {

	//options is not used for anything right now.

	var userObj = {};

	userObj.save = function(req, res, next) {

		console.log('about to save user');

		if (req.user._id)
		{
			//The only possible update that can happen is that we are registering as an employee after having registered as an employer first.

			Employee.findOne({ pid: req.body.PID }, function(err, emp) {
				if (err) throw err;

				console.log('ok, res ' + emp);

				if (!emp)
				{
					return res.end('employee not found in system, registration not allowed');
				}

				console.log('found employee with id ' + emp._id + ' for pid ' + req.body.PID);

				User.update({_id: req.user._id}, { $set: { _employee: emp._id }}, function (err) {
					if (err) throw err;

					req.user._employee = emp._id;

					return res.redirect('/index.html');
				});
			});
		}
		else
		{			
			var user = new User();
			user.providerId = req.user.providerId;
			user.displayName = req.user.displayName;
			user._employer =  mongoose.Types.ObjectId();
			
			console.log(user);

			user.save(function(err, user) {
				if (err) throw err;			

				console.log('user saved, new id: ' + user._id);

				req.user._employer = user._employer;

				delete req.user.unregistered;

				return res.redirect('/index.html');
			});
		}
	}

	return userObj;
}