console.log("sup bro");

// requests look like: https://api.twitch.tv/api/users/username/follows/games/live?on_site=1
const regex = new RegExp("^https?://api\\.twitch\\.tv/api/users/[^/?]+/follows/games/live\\?on_site=1$");
const matchPattern = "*://api.twitch.tv/api/users/*/follows/games/*"; // same as the pattern in the manifest

function listener(requestDetails) {
  
  // make sure the url actually matches
  if (regex.test(requestDetails.url)) {
    const modifiedUrl = requestDetails.url + "&limit=200";
    console.log("rewriting", requestDetails.url, "to", modifiedUrl);
    return {redirectUrl: modifiedUrl};
  } else {
    return {}; // do nothing
  }
}

browser.webRequest.onBeforeRequest.addListener(listener, {urls: [matchPattern]}, ["blocking"]);
