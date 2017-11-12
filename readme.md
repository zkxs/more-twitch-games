# More Twitch Games
A browser extension to increase the number of games loaded on the "Games You Follow" page.

## Why make this?
I've noticed that the auto-loading of games sometimes fails miserably on [twitch.tv/directory/following/games](https://www.twitch.tv/directory/following/games), meaning you never get to see the games you follow past the first 20. This causes some of my favorite games to never appear in my list.

## How does it work?
Twitch makes api calls to `https://api.twitch.tv/api/users/yourusername/follows/games/live?on_site=1`, and I simply append `&limit=200` onto those requests.
