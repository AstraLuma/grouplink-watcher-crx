var JSON_URL = "https://itsupport.grcc.edu:8443/ehelpdesk/tf/ticketFilterStore.glml?filter=true&ticketFilterId=";

var DEFAULT_FILTER = '962',
	DEFAULT_TIME = 5.0;

var COLOR_EMPTY = "#080",
	COLOR_ITEMS = "#F00",
	COLOR_ERROR = "#FF0",
	COLOR_WORKING = "#888";

var last_filter_response = {};

var req = false;

function QueryUrl(callback) {
	chrome.storage.sync.get("filter", function(obj) {
		callback(JSON_URL+obj.filter);
	});
}

function update(callback) {
	if (req && req.readyState != req.DONE) return;
	req = new XMLHttpRequest();
	req.addEventListener("load", function(evt) {
		var data = JSON.parse(this.response);
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
		console.error(this);
		chrome.browserAction.setBadgeText({text: "!!"});
		chrome.browserAction.setBadgeBackgroundColor({color: COLOR_ERROR});
	});
	req.addEventListener("loadend", function(evt) {
		req = false;
		chrome.storage.sync.get("polltime", function(obj) {
			chrome.alarms.create("update", {
				delayInMinutes: obj.polltime,
				periodInMinutes: obj.polltime,
			});
		});
		if (callback) callback();
	});
	QueryUrl(function(url) {
		req.open("GET", url, true);
		req.send();
		chrome.browserAction.setBadgeBackgroundColor({color: COLOR_WORKING});
	});
}

window.addEventListener("online", update); //FIXME: Replace with something compatible with event pages

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		polltime: DEFAULT_TIME,
		filter: DEFAULT_FILTER
	});
	chrome.alarms.onAlarm.addListener(update);
	chrome.browserAction.setBadgeText({text: "..."});
	chrome.browserAction.setBadgeBackgroundColor({color: COLOR_WORKING});
});

chrome.runtime.onStartup.addListener(function() {
	update();
});