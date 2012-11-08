function update() {
	return chrome.extension.getBackgroundPage().update();
}

$(function() {

$('#filter').change(function() {
	var v = $('#filter').val();
	chrome.sync.set({filter: v}, update);
});

$('#polltime').change(function() {
	var v = parseFloat($('#polltime').val());
	if (isNaN(v)) {
		$('#polltime').addClass("error");
	} else {
		$('#polltime').removeClass("error");
		chrome.sync.get('polltime', function(obj) {
			chrome.sync.set({polltime: v}, function() {
				if (obj.polltime > v) {
					update();
				}
			});
		});
	}
});

chrome.sync.get(['filter', 'polltime'], function(obj) {
	$('#filter').val(obj.filter);
	$('#polltime').val(obj.polltime);
});

$('#updatenow').click(update);
});