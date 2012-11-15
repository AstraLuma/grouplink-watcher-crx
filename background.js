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

var Badge = {
		setTickets: function(nr) {
			chrome.browserAction.setBadgeText({text: nr.toString()});
			if (nr) {
				chrome.browserAction.setBadgeBackgroundColor({color: COLOR_ITEMS});
			} else {
				chrome.browserAction.setBadgeBackgroundColor({color: COLOR_EMPTY});
			}
		},
		setError: function() {
			chrome.browserAction.setBadgeText({text: "!!"});
			chrome.browserAction.setBadgeBackgroundColor({color: COLOR_ERROR});
		},
		setWorking: function() {
			chrome.browserAction.setBadgeBackgroundColor({color: COLOR_WORKING});
			chrome.browserAction.getBadgeText({}, function(text) {
				if (!text) {
					chrome.browserAction.setBadgeText({text: "..."});
				}
			});
		}
};

function update(callback) {
	if (req && req.readyState != req.DONE) return;
	Badge.setWorking();
	req = new XMLHttpRequest();
	req.addEventListener("load", function(evt) {
		var data;
		if (this.responseType == "json") {
			data = this.response;
		} else {
			try {
				data = JSON.parse(this.response);
			} catch(err) {
				Badge.setError();
				throw err;
			}
		}
		last_filter_response = data;
		Badge.setTickets(data.numRows);
	});
	req.addEventListener("error", function(evt) {
		console.error(this);
		Badge.setError();
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
	req.responseType = "json";
	QueryUrl(function(url) {
		req.open("GET", url, true);
		req.send();
	});
}

window.addEventListener("online", update); //FIXME: Replace with something compatible with event pages

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({
		polltime: DEFAULT_TIME,
		filter: DEFAULT_FILTER
	});
	chrome.alarms.onAlarm.addListener(update);
	update();
});

chrome.runtime.onStartup.addListener(function() {
	update();
});