var FILTER_ID = "962";

var JSON_URL = "https://itsupport.grcc.edu:8443/ehelpdesk/tf/ticketFilterStore.glml?filter=true&ticketFilterId="+FILTER_ID;
var PAGE_URL = "https://itsupport.grcc.edu:8443/ehelpdesk/tf/ticketFilterResults.glml?tfId="+FILTER_ID;

function getdata(callback, errback) {
	/*var req = new XMLHttpRequest();
	req.addEventListener("load", function(evt) {
		var data = JSON.parse(req.response);
		callback(data, evt);
	});
	req.addEventListener("error", function(evt) {
		errback(evt);
	});
	req.open("GET", JSON_URL, true);
	req.send();*/
	callback(chrome.extension.getBackgroundPage().last_filter_response);
}

function createblock(data) {
	var priority = data['ticketFilter.priority'].split(' ')[0][1];
	
	var building = data['ticketFilter.location'].split(' ')[0];
	var roomtitle, room;
	
	roomtitle = data['ticketFilter.location'];
	if (building == '-NONE') {
		room = '';
	} else {
		room = building; //TODO: Get the room number
	}
	
	var e = 
	$("<div class='ticket'></div>")
	.addClass('P'+priority)
	.attr('title', data['ticketFilter.note'])
	.append(
		$("<span class='priority'></span>").text(priority)
			.attr('title', data['ticketFilter.priority']),
		$("<div></div>").append(
			$("<span></span>").text(data['ticketFilter.ticketNumber']),
			$("<span></span>").text(data['ticketFilter.contact']),
			$("<span></span>").text(room)
				.attr('title', roomtitle),
			$("<span></span>").text(data['ticketFilter.created'])
		),
		$("<div></div>").append(
			$("<span></span>").text(data['ticketFilter.category']),
			$("<span></span>").text(data['ticketFilter.catopt'])
		),
		$("<div></div>").text(data['ticketFilter.subject'])
	)
	.click(function() {
		var n = data['ticketFilter.ticketNumber'].toString();
		chrome.tabs.create({
			url: "https://itsupport.grcc.edu:8443/ehelpdesk/ticket/edit2.glml?tid="+n,
			active: true,
		});
	});
	return e;
}

function update() {
	getdata(function(tickets) {
		$('#tickets').empty();
		tickets.items.forEach(function(ticket) {
			$('#tickets').append(createblock(ticket));
		});
	});
}

$(function() {
	$('#update').click(update);
	update();
});
