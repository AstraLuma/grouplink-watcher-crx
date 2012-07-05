function update() {
	return chrome.extension.getBackgroundPage().update();
}

$(function() {

$('#filter').change(function() {
	var v = $('#filter').val();
	jsonStorage.set('filter', v);
	update();
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
			update();
		}
	}
});

$('#filter').val(jsonStorage.get('filter'));
$('#polltime').val(jsonStorage.get('polltime'));

$('#updatenow').click(update);
});