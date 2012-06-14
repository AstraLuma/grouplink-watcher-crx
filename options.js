$(function() {

$('#filter').change(function() {
	var v = $('#filter').val();
	jsonStorage.set('filter', v);
	chrome.extension.getBackgroundPage().update();
});

$('#polltime').change(function() {
	var v = parseFloat($('#polltime').val());
	if (isNaN(v)) {
		$('#polltime').addClass("error");
	} else {
		$('#polltime').removeClass("error");
		var old = jsonStorage.get('polltime');
		jsonStorage.set('polltime', v);
		if (old > v) {
			chrome.extension.getBackgroundPage().update();
		}
	}
});

$('#filter').val(jsonStorage.get('filter'));
$('#polltime').val(jsonStorage.get('polltime'));
});