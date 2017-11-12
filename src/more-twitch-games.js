// legacy requests look like: https://api.twitch.tv/api/users/username/follows/games/live?on_site=1
// new requests look like: https://gql.twitch.tv/gql
const legacyUrlRegex = new RegExp("^https?://api\\.twitch\\.tv/api/users/[^/?]+/follows/games/live\\?on_site=1$");
const legacyMatchPattern = "*://api.twitch.tv/api/users/*/follows/games/*";
const newMatchPattern = "*://gql.twitch.tv/gql";

function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function stringToArrayBuffer(string) {
  const stringLength = string.length;
  const buffer = new ArrayBuffer(stringLength);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0; i < stringLength; i++) {
    bufferView[i] = string.charCodeAt(i);
  }
  return buffer;
}

function legacyRequestListener(requestDetails) {
  
  // make sure the url actually matches
  if (legacyUrlRegex.test(requestDetails.url)) {
    const modifiedUrl = requestDetails.url + "&limit=200";
    console.log("rewriting", requestDetails.url, "to", modifiedUrl);
    return {redirectUrl: modifiedUrl};
  } else {
    return {}; // do nothing
  }
}

function newRequestListener(requestDetails) {
  
  if (requestDetails.method === "POST" && requestDetails.requestBody) {
    const buffer = requestDetails.requestBody.raw[0].bytes;
    const string = arrayBufferToString(buffer);
    
    try {
      const object = JSON.parse(string);
      let modified = false;
      for (const query of object) {
        if (query.operationName === "FollowingGames_CurrentUser") {
          query.variables.limit = 200;
          modified = true;
        }
      }
      
      if (modified) {
        console.log("Patching GQL request", requestDetails.method, requestDetails.url, object, "initiated by", requestDetails.originUrl);
        requestDetails.requestBody.raw[0].bytes = stringToArrayBuffer(JSON.stringify(object));
      }
      
    } catch (error) {
      console.error(error, error.stack);
      console.error(string);
    }
    
  }
  
  return {};
}

browser.webRequest.onBeforeRequest.addListener(legacyRequestListener, {urls: [legacyMatchPattern]}, ["blocking"]);
browser.webRequest.onBeforeRequest.addListener(newRequestListener, {urls: [newMatchPattern]}, ["blocking", "requestBody"]);

console.log("Finished loading more-twitch-games.js");
