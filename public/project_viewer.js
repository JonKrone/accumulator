var fileSelector = document.getElementById("selector");
fileSelector.addEventListener("change", loadCurrentFile); // might need to be positions below loadCurrentFIle function definition

var htmlRadio = document.getElementById("html");
var jsRadio = document.getElementById("js")
var iframe = document.getElementById("page");

var fs = require('fs'), path = require('path');

	var option = document.createElement("option");
	option.textContent = file;
	fileSelector.appendChild(option);


findFiles('public_projects/');
// to create a directory tree, we can iterate through storing all relevent files in a tree and then
// compute the tree into a selection list
function findFiles(pathRoot) {
	var fileType = ".html";
	if (jsRadio.checked) fileType = ".js";

	if (!fs.existsSync(pathRoot))
		throw new Error("Attempting to dive into a path that does not exist" + pathRoot);

	var fileDir = fs.readDirSync(pathRoot);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, fileDir[i]);
		var stat = fs.lstatSync(filename);
		
		if(stat.isDirectory())
			// If directory, insert unclickable option in select list declaring the file dir
			findFiles(filename);
		else if (filename.indexOf(fileType) >= 0) {
			var option = document.createElement("option");
			option.textContent = fileDir[i];
			option.setAttribute("data-path", filename);
			fileSelector.appendChild(option);
		}
	}
}

// function request(options, callback) {
// 	var req = new XMLHttpRequest();
// 	req.open(options.method || "GET", options.pathname, true);

// 	req.addEventListener("load", function() {
// 		if (req.status < 400)
// 			callback(null, req.responseText);
// 		else
// 			callback(new Error("Request failed: " req.statusText));
// 	});
// 	req.addEventListener("error", function() {
// 		callback(new Error("Network error"));
// 	});
// 	req.send(options.body || null);
// }

// request({pathname: "/"}, function(error, files) {
// 		if (error) throw error;
// 		
//	}

// 	loadCurrentFile();
// });

function loadCurrentFile() {
	request({pathname: filelist.value}, function(error, file) {
		if (error) throw error;
		iframe.src = file;
	})
}