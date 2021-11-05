// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mediaArtsSearch = {q: "#birds", count: 10, result_type: "recent"}; 

var wordsOfBirds = ["Chirp ", "Caw ", "Hoot ", "Cluck", "Tweet"]; // array of that will be added to the response

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		let tweetLocation = ' https://twitter.com/TwitterDev/statuses/' + retweetId; // This url allows for the bot to find and create a quote tweet
		let text = data.statuses[0].text; // text of the most recent tweet that was unquoted
		const words = text.split(" "); // splits the text into words based off of spaces
		let length = words.length; // length of words == number of words in the Tweet
		let counter = 0; // counter variable
		let birdWords = ""; // Response that will be generated
		let translation = "Bird Language: " // prefix to the Response
		while (counter < length && translation.length + tweetLocation.length + birdWords.length + 6 < 280) { // This loop goes until the tweet has 280 characters or all the words have
																											 // have been replaced with bird language
			birdWords += words[Math.floor(Math.random()*wordsOfBirds.length)]; // using the Math functions, a number from 0 to wordsOfBirds.length, then is thranslated into a number 
																			   // that the array can handle
		}
		T.post('statuses/update/', {status: translation + birdWords + tweetLocation}, function (error, response) { // this creates a new post, but because of tweetLocation, 
																												   // a Quote Tweet is created
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 5);
