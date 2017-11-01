var fs = require("fs")
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter")
var request = require("request")
var twitter = keys.twitterKeys
var spotify = keys.spotifyKeys
var omdb = keys.omdbKeys
var userInput = process.argv[2]
var userSearch = ""
for (var i = 3; i < process.argv.length; i++) {
    userSearch += process.argv[i] + " "
}

var client = new Twitter({
    consumer_key: twitter.consumer_key,
    consumer_secret: twitter.consumer_secret,
    access_token_key: twitter.access_token_key,
    access_token_secret: twitter.access_token_secret
});
var spotify = new Spotify({
    id: spotify.id,
    secret: spotify.secret
});

function commands(userInput, userSearch) {
    if (userInput === "my-tweets") {
        var params = { screen_name: 'vintageslacker', count: 20 };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log(tweets[i].created_at)
                }

            }
        });
    }

    if (userInput === "spotify-this-song") {
        var searchQuery = "The Sign Ace of Base"
        if (userSearch) {
            searchQuery = userSearch
        }

        spotify.search({ type: 'track', query: searchQuery, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log(data.tracks.items[0].album.artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify)
            console.log(data.tracks.items[0].album.name);
        });
    }

    if (userInput === "movie-this") {
        var searchQuery = "Mr Nobody"
        if (userSearch) {
            searchQuery = userSearch
        }

        request("http://www.omdbapi.com/?apikey=40e9cece&t=" + searchQuery + "", function (error, response, body) {

            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log(JSON.parse(body).imdbRating);
            console.log(JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);
        });
    }

    var textFile = "random.txt"
    if (userInput === "do-what-it-says") {
        fs.readFile(textFile, "utf8", function (error, data) {
            if (error) {
                console.log(error);
            }
            userInput = data.split(",")[0];
            userSearch = JSON.parse(data.split(",")[1].trim());
            commands(userInput, userSearch)

        })
    }
}

commands(userInput,userSearch);