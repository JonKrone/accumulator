var express = require('express');
var app = express();

// Setting port property. env.PORT is online port while 5555 is default localhost
app.set('port', (process.env.PORT || 5555));

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');

// set view engine to ejs
app.set('view engine', 'ejs');

// set home page route
app.get('/', function(request, response) {
  response.render('culminator');
});

app.get('/projectlist', function(request, response) {
	var fileList = findFiles("public/projects/");

	response.send(fileList);
	// console.log(request);
	console.log("We've triggered app.get/projects");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});





var fs = require('fs'), path = require('path');
var projectFiles = []; // I know I shouldn't be defining a variable outside of a container because 
// it reduces independence and its scope is too high.

// to create a directory tree, we can iterate through storing all relevent files in a tree and then
// compute the tree into a selection list
function findFiles(pathRoot) {

	if (!fs.existsSync(pathRoot))
		throw new Error("Attempting to dive into a path that does not exist" + pathRoot);

	var fileDir = fs.readdirSync(pathRoot);
	for (var i = 0; i < fileDir.length; i++) {
		var filename = path.join(pathRoot, fileDir[i]);
		var stat = fs.lstatSync(filename);
		
		if(stat.isDirectory())
			// If directory, insert unclickable option in select list declaring the file dir
			findFiles(filename);
		else {
			// console.log("filename:", filename);
			projectFiles.push(filename);
		}
	}

	return projectFiles;
}



