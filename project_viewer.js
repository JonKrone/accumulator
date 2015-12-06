var fileSelector = document.getElementById("selector");
fileSelector.addEventListener("change", loadCurrentFile); // might need to be positions below loadCurrentFIle function definition

var htmlRadio = document.getElementById("html");
var jsRadio = document.getElementById("js")
var iframe = document.getElementById("page");


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