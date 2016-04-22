// ==UserScript==
// @name        More Twitch Games
// @namespace   http://zcraft.no-ip.org:8080/
// @description Increase maximum displayed followed games on Twitch.
// @include     /^https?://api\.twitch\.tv/crossdomain/receiver.html(\?.*)?$/
// @version     1
// @grant       none
// @run-at document-start
// ==/UserScript==

(function(open) {
	var regex = new RegExp("^https?://api\\.twitch\\.tv/api/users/[^/]+/follows/games/live\\?on_site=1$");
	XMLHttpRequest.prototype.open = function() {
		if ( regex.test(arguments[1]) ) {
			arguments[1] += "&limit=200";
			console.log("Modified " + arguments[0] + " request to " + arguments[1]);
		}	
		open.apply(this, arguments);
	};
})(XMLHttpRequest.prototype.open);
