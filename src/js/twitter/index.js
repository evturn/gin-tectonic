import { Server as WebSocketServer } from 'ws';
import Twit from 'twit';
import { Observable } from 'rx';

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

function onConnect(ws) {
  console.log('Client connected on localhost:8080');

  const stream = T.stream('statuses/filter', {
      track: 'earthquake',
      locations: []
    }
  );

  Observable.fromEvent(stream, 'tweet')
    .subscribe(tweetObject => {
      ws.send(JSON.stringify(tweetObject), err => {
        if (err) {
          console.log('There was an error sending the message');
        }
      });
    });

  const onMessage = Observable.fromEvent(ws, 'message')
    .subscribe(quake => {
      quake = JSON.parse(quake);
      console.log(quake);
    });
}

const Server = new WebSocketServer({ port: 8080 });

Observable.fromEvent(Server, 'connection')
  .subscribe(onConnect);