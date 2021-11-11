// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mediaArtsSearch = {q: "#birds", count: 10, result_type: "recent"}; 

var wordsOfBirds = ["Chirp ", "Caw ", "Hoot ", "Cluck ", "Tweet "]; // array of that will be added to the response

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
		let tweet = data.statuses[6]; // obtains recent tweet
		if (tweet.retweeted_status != null) { // checks to see if tweet is a retweet
			tweet = tweet.retweeted_status; // if so, tweet becomes original tweet and not the retweet
		}
		const retweetId = tweet.id_str; // id_str of the tweet
		let text = tweet.text; // text of the most recent tweet that was unquoted
		const words = text.split(" "); // splits the text into words based off of spaces
		let length = words.length; // length of words == number of words in the Tweet
		let counter = 0; // counter variable
		let birdWords = ""; // Response that will be generated
		let translation = "Bird Language: " // prefix to the Response
		while (counter < length && translation.length + birdWords.length + 6 < 280) { //while counter is less than num. of words and length of new tweet is lees than 280 characters
			birdWords += wordsOfBirds[Math.floor(Math.random()*wordsOfBirds.length)]; // adds random word from bird words
			counter++; // word added
		}
		T.post('statuses/retweet/' + retweetId, {}, function (error, response) {  // rewtweets the specified tweet
			if (response) { // if success
				console.log('Success! Check your bot, it should have retweeted something.');
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) { // else
				console.log('There was an error with Twitter:', error);
			}
		});
		const userName = tweet.user.screen_name; // username of the author of the specified tweet
		console.log(userName);
		const status1 =  `@${userName} I Like birds`; // text that the bot will resond with, the @username is required to allow the bot to reply
		const in_reply_to_status_id1 =  tweet.id_str; // id of the specified tweet
		console.log(in_reply_to_status_id1);
		console.log(retweetId);
		T.post('statuses/update', {status: status1, in_reply_to_status_id: in_reply_to_status_id1}, function (error, response) { // tweets a reply to the tweet at in_reply_to_status_id1
			if (response) { // if success
				console.log('Success! Check your bot, it should have replied something.');
				console.log(response);
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) { // else
				console.log('There was an error with Twitter:', error);
			}
		});
		T.post('statuses/update', {status: translation + birdWords}, function (error, response) { // this creates a new post that contains the translated text
			if (response) { // if success
				console.log('Success! Check your bot, it should have posted something.');
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) { // else
				console.log('There was an error with Twitter:', error);
			}
		});
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
