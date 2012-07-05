function getdata(callback, errback) {
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
		$("<div class='sidebar'></div>").append(
			$("<div></div>").text(data['ticketFilter.ticketNumber']),
			$("<div class='priority'></div>").text(priority)
				.attr('title', data['ticketFilter.priority'])
		),
		$("<div></div>").append(
			$("<div></div>").append(
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


	$('#updatenow').click(function() {
		chrome.extension.getBackgroundPage().update(function() {
			update();
		});
	});
});
