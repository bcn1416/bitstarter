var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
	var url = '/index.html';
	path.join(__dirname, url);
	response.send((fs.readFileSync(url)).toString());
	//response.send((fs.readFileSync('index.html')).toString());
	//response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port: " + port);
});
