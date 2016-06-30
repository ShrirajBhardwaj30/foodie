/**
* Description: Contains non angular javascript code
* @author: Atul Rajmane
*/

window.onload = function() {
	if (window.location.hash == "#/") {
		showModalDialogue();
	}
}

/**
* Load the modal dialogue
*/
function showModalDialogue() {
	setTimeout(function() {
		$("#myModal").modal({
			backdrop: 'static',
			keyboard: false
		});
	}, 250);
	
}