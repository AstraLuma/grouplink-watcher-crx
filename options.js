function update() {
	return chrome.extension.getBackgroundPage().update();
}

$(function() {

$('#filter').change(function() {
	var v = $('#filter').val();
	chrome.storage.sync.set({filter: v}, update);
});

$('#polltime').change(function() {
	var v = parseFloat($('#polltime').val());
	if (isNaN(v)) {
		$('#polltime').addClass("error");
	} else {
		$('#polltime').removeClass("error");
		chrome.storage.sync.get('polltime', function(obj) {
			chrome.storage.sync.set({polltime: v}, function() {
				if (obj.polltime > v) {
					update();
				}
			});
		});
	}
});

chrome.storage.sync.get(['filter', 'polltime'], function(obj) {
	$('#filter').val(obj.filter);
	$('#polltime').val(obj.polltime);
});

$('#updatenow').click(update);
});