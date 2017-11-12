(function(fetch) {
  const regex = new RegExp("^https?://gql\\.twitch\\.tv/gql/?$");
  
  // wrap fetch() in a shim
  window.fetch = function() {
    const input = arguments[0];
    
    // find the request URL
    let url = null;
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof Request) {
      url = input.url;
    }
    // if input is neither a string nor a Request, someone is using fetch() wrong.
    
    if (url !== null && regex.test(url)) { // check to make sure this request is to the URL we're watching
      const init = arguments[1];
      if (init && init.method && init.method.toUpperCase() === "POST") { // make sure it is a POST request
        if (init.body) { // make sure it has a body
          const body = init.body;
          if (typeof body === "string") {
            try {
              const gqlQueries = JSON.parse(body);
              let modified = false;
              for (const query of gqlQueries) {
                if (query.operationName === "FollowingGames_CurrentUser") {
                  if (query.variables.limit !== 100) {
                    console.log("Modified GQL query", query);
                    query.variables.limit = 100; // apparently the server enforces a limit of 100
                    modified = true;
                  }
                }
              }
              
              if (modified) {
                // write changes
                init.body = JSON.stringify(gqlQueries);
              }
            } catch (error) {
              // for when JSON parsing goes wrong
              console.error(error, error.stack);
            }
          } else { // if the body is not a string
            console.error("Intercepted fetch request to", url, "with unsupported body", body);
          }
        }
      }
    }
    
    return fetch.apply(this, arguments); // finally, call the original fetch() function
  }
  
  console.log("[More Twitch Games] Injected xhr-shim.js");
  
})(window.fetch);
