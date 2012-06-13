var FILTER_ID = "962";

var JSON_URL = "https://itsupport.grcc.edu:8443/ehelpdesk/tf/ticketFilterStore.glml?filter=true&ticketFilterId="+FILTER_ID;
var PAGE_URL = "https://itsupport.grcc.edu:8443/ehelpdesk/tf/ticketFilterResults.glml?tfId="+FILTER_ID;

var COLOR_EMPTY = "#080",
	COLOR_ITEMS = "#F00",
	COLOR_ERROR = "#FF0",
	COLOR_WORKING = "#888";

var last_filter_response = {};

function update() {
	var req = new XMLHttpRequest();
	req.addEventListener("load", function(evt) {
		var data = JSON.parse(req.response);
		last_filter_response = data;
		var nr = data.numRows;
		chrome.browserAction.setBadgeText({text: nr.toString()});
		if (nr) {
			chrome.browserAction.setBadgeBackgroundColor({color: COLOR_ITEMS});
		} else {
			chrome.browserAction.setBadgeBackgroundColor({color: COLOR_EMPTY});
		}
	});
	req.addEventListener("error", function(evt) {
		var data = JSON.parse(req.response);
		chrome.browserAction.setBadgeText({text: "!!"});
		chrome.browserAction.setBadgeBackgroundColor({color: COLOR_ERROR});
	});
	req.open("GET", JSON_URL, true);
	req.send();
}

chrome.browserAction.setBadgeText({text: "..."});
chrome.browserAction.setBadgeBackgroundColor({color: COLOR_WORKING});
update();
window.addEventListener("online", update);
window.setInterval(update, 5*60*1000);