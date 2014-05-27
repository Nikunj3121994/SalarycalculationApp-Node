exports.send404 = function (response) {
	response.writeHead(404, { 'Content-Type': 'text/plain'});
	response.write('Error 404');
	response.end();
}