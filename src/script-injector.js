const script = document.createElement('script');
script.src = chrome.extension.getURL('web_accessible_resources/xhr-shim.js'); // this must be in web_accessible_resources in manifest.json
script.onload = function() {
  this.remove(); // remove this script from the DOM as soon as the page is loaded
};
(document.head || document.documentElement).appendChild(script);
