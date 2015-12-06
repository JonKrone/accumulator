var fs = require('fs'), path = require('path');

findFiles('public_projects/');



function findFiles(pathRoot) {
	var fileType = ".html";

	if (!fs.existsSync(pathRoot))
		throw new Error("Attempting to dive into a path that does not exist" + pathRoot);

	var fileDir = fs.readdirSync(pathRoot);
	for (var i = 0; i < fileDir.length; i++) {
		var filename = path.join(pathRoot, fileDir[i]);
		var stat = fs.lstatSync(filename);
		if (filename.indexOf("node_modules") >= 0) continue;
		
		if(stat.isDirectory()) {
			// If directory, insert unclickable option in select list declaring the file dir
			console.log("In directory:", filename);
			findFiles(filename);
		}	else if (filename.indexOf(fileType) >= 0) {
			console.log("Adding file to options:", fileDir[i]);
		}
	}
}