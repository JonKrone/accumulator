var iframe = $('#DOC')[0];
var fileSelector = $('#selector');

function populateSelector() {

	var request = new XMLHttpRequest();
	request.open('GET', 'projectList/', true);

	request.addEventListener('load', function() {
		if (request.status >= 400) {
			console.log(request.status);
			throw new Error('Failed to load projects list');
		}
		else {
			// Institute a preferred project order?
			// Handle response from our request for all projects.

			// Change server to send a JSON filepath without public/projects 
			// forEach loop is only there to remove quotes. Look to remove this through JSON parsing
			var fileList = [];
			request.responseText.split(',').forEach(function(filepath) {
				fileList.push(filepath.replace(/"/g, ''));
			});
			// fileList = request.responseText.split(',');


			for (var i = 0; i < fileList.length; i++) {
				var option = $('<option/>', {
					value: fileList[i],
					text: fileList[i].substring(
					fileList[i].lastIndexOf('/') + 1,
					fileList[i].lastIndexOf('.'))
				});

				fileSelector.append(option);
			}
		}
	});
	request.addEventListener('error', function() {
		throw new Error('Network error');
	});
	request.send();
}
populateSelector();


// Update our iframe to display the currently selected project file. We ask the server
// for the html representation of our project by passing an encoded project url, throwing errors left
// and right, and add a change listener to the file selector.
//
// We're using AJAX to handle requests + responses on the client side.
function loadFile(file) {
	console.log('loading project: ', file);
	var encodedFilepath = encodeURIComponent(file);

	var onSuccess = function (result, status) {
		if (status != 'success') {
			throw new Error('Mistake loading project file\nRequest status: ' + status);
		}
		else {
			iframe.contentWindow.document.open();
			iframe.contentWindow.document.write(result.htmlSource);
			$(contentAreas[1]).val(result.htmlSource);

			var docJS = "";
			$(iframe).contents().find('script').each(function() {
				docJS += '\n' + $(this).html();
			});

			$(contentAreas[2]).val(docJS);
		}
	};

	$.getJSON('projects/',
						{ remotePath: encodedFilepath },
						onSuccess);
}

fileSelector.on('change', function() {
	var selectedFile = $('#selector option:selected').attr('value');
	$('#iframeFile').text(selectedFile);

	loadFile(selectedFile);

	$('#DOC-tab').trigger('click');
	$(iframe).focus();
});
