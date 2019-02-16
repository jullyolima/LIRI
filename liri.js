var keys = require("./keys.js");
var axios = require("axios");
var dotEnv = require('dotenv')
require("dotenv").config();
var Spotify = require('node-spotify-api');
var moment = require('moment');
var Spotify = new Spotify(keys.spotify);
var fs = require('fs');

var arr = process.argv;
var search = process.argv[2];
var term = "";

for (var i = 3; i < arr.length; i++) {

    if (i > 3 && i < arr.length) {
        term = term + "+" + arr[i];
    } else {
        term += arr[i];

    }
}

function findConcert() {
    console.log("Searching for a concert based on artist")
    var queryUrl = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            var divider = "\n------------------------------------------------------------\n\n";
            var jsonData = response.data[0];
            // movie ends up being the string containing the show data we will print to the console
            var ConcertData = [
                "Show Venue: " + jsonData.venue.name,
                "Venue Location: " + jsonData.venue.city + " " + jsonData.venue.region,
                "Date of Event: " + jsonData.datetime
            ].join("\n\n");

            fs.appendFile("log.txt", ConcertData + divider, function (err) {
                if (err) throw err;
            });
            console.log(ConcertData)
        }
    );
}

function findSong() {
    console.log("Searching for a song")
    Spotify.search({
        type: 'track',
        query: term
    }, function (err, data) {
        var divider = "\n------------------------------------------------------------\n\n";
        if (err) {
            return console.log('Error occurred: ' + err);
        } else
            //console.log(data.tracks.items[0]);
            var jsonData = data.tracks.items[0]
        var songData = [
            "Artist: " + jsonData.artists[0].name,
            "Song Name: " + jsonData.name,
            "Preview Link: " + jsonData.preview_url,
            "Album: " + jsonData.album.name
        ].join("\n\n");

        fs.appendFile("log.txt", songData + divider, function (err) {
            if (err) throw err;
        });
        console.log(songData)
    });
}

function findMovie() {
    console.log("Searching for a movie")
    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
            function (response) {
                var divider = "\n------------------------------------------------------------\n\n";
                var jsonData = response.data;
                // showData ends up being the string containing the show data we will print to the console
                var movie = [
                    "Title: " + jsonData.Title,
                    "Release Year: " + jsonData.Year,
                    "IMDB Rating: " + jsonData.Ratings[0].Value,
                    "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                    "Country of production: " + jsonData.Country,
                    "Language: " + jsonData.Language,
                    "Plot: " + jsonData.Plot,
                    "Actors: " + jsonData.Actors
                ].join("\n\n");

                fs.appendFile("log.txt", movie + divider, function (err) {
                    if (err) throw err;
                });
                console.log(movie)
            })
    
}



if (search === "spotify-this-song") {
    findSong()
}
else if (search === "concert-this") {
    findConcert();
}
else if (search === "movie-this") {
    findMovie();
}
