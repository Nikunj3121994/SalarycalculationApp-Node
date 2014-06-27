//Error handling module, this first version is directly from http://www.itamarweiss.com/post/57962670227/error-handling-in-node-js-express
module.exports = function (options) {

	var errorhandler = {};
	
	errorhandler.handleUnhandledRequests = function(req, res, next) {
		res.status(404);

		if (req.accepts('html')) {
			res.sendfile('./public/404.html');
			return;
		}

		if (req.accepts('json')) {
			res.send({ error: 'Not found' });
			return;
		}

		res.type('txt').send('Not found');
	}

	errorhandler.handleServerErrors = function (err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		res.sendfile('./public/500.html');
	}

	return errorhandler;
}