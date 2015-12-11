var iframe = $('#DOC')[0];
var fileSelector = $('#selector');

// We are populating the select tag with all of the projects found on the server.
// We use AJAX to ask for a JSON file of our projects. We parse the response to fill the select with options
// with values that serve as the server file path and text that represents project file names.
function populateSelector() {
	// Institute a preferred project order
	// 

	var onSuccess = function (result, status) {
		if (status != 'success') {
			throw new Error('Mistake loading project list\nRequest status: ' + status);
		}
		else {

			for (var i = 0; i < result.length; i++) {

				var option = $('<option/>', {
					value: result[i],
					text: result[i].substring(
					result[i].lastIndexOf('/') + 1,
					result[i].lastIndexOf('.'))
				});
				fileSelector.append(option);
			}
		}
	};

	$.getJSON('projectList/',
						{},
						onSuccess);
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
