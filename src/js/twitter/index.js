const WebSocketServer = require('ws').Server;
const Twit = require('twit');
const Rx = require('rx');

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

function onConnect(ws) {
  console.log('Client connected on localhost:8080');
}

const Server = new WebSocketServer({ port: 8080 });

Rx.Observable
  .fromEvent(Server, 'connection')
  .subscribe(onConnect);