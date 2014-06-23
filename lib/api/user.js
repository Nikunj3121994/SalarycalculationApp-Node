var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(options) {

	//options is not used for anything right now.

	var user = {};

	user.save = function(req, res, next) {

		console.log('about to save user');

		var user = new User();

		user.providerId = req.user.providerId;
		user.displayName = req.user.displayName;
		user._employer =  mongoose.Types.ObjectId();

		user.save(function(err, user) {
			if (err) throw err;			

			console.log('user saved, new id: ' + user._id);

			req.user._employer = user._employer;
			delete req.user.unregistered;

			return res.redirect('/index.html');			
		});
	}

	return user;
}