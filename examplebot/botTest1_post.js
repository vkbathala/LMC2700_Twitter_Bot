// Our Twitter library
var Twit = require('twit');
// call our config file
var config = require('./config')
// We need to include our configuration file
var T = new Twit(config);


// YOUR CODE HERE
var tweet = {
    status: 'Hello World,I am ZYCbot4'
}

T.post('statuses/update',tweet,tweeted);

function tweeted(err,data,response){
    if (err){
        console.log("Something wrong!");
    }else{
        console.log("It worked!");
    }
}

