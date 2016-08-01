# More Twitch Games
A Greasemoney userscript to increase the number of games loaded on the "Games You Follow" page.  
**[Click here](https://github.com/zkxs/more-twitch-games/raw/master/More_Twitch_Games.user.js)** to install the userscript.

## Why make this?
I've noticed that the auto-loading of games sometimes fails miserably on [twitch.tv/directory/following/games](https://www.twitch.tv/directory/following/games), meaning you never get to see the games you follow past the first 20. This caused some of my favorite games to never appear in my list.

## How does it work?
It's really sketchy. I *wanted* to tamper with the function in Twitch's javascript that actually makes the API call to  `https://api.twitch.tv/api/users/yourusername/follows/games/live?on_site=1`, but for the life of me I couldn't figure out where it was. But there's another way. When making any HTTP request from javascript, no matter what fancy libary is used, the underlying function is `XMLHttpRequest.open()`. This userscript replaces `XMLHttpRequest.open()` with a function of my own design. Most requests are ignored by it and simply passed onto the real `XMLHttpRequest.open()`, but requests that match a certain pattern have `&limit=200` appended to them. That's it.

