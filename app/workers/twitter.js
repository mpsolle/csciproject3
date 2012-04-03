var http = require('http');
var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');
var url;

//create redis client      
function TwitterWorker(terms) {                                                                                                                                                                                                                 
var client = redis.createClient();

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: [terms] },
    function(stream) {
        stream.on('data', function(tweet) {
            		try {
						if (tweet.entities.urls[0].expanded_url != " ") { 
							url = tweet.entities.urls[0].expanded_url; 
							}
				
						else if (tweet.entities.urls[0].url !=  " ") {
							url = tweet.entities.urls[0].url;
							}
							
					console.log(url);
					client.zincrby(word, 1, url); 
				}
				catch (error) {
				}



        });
    }
  );
 };

  module.exports = TwitterWorker;