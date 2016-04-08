import { Server as WebSocketServer } from 'ws';
import Twit from 'twit';
import { Observable } from 'rx';

function onConnect(ws) {
  console.log('Client connected on localhost:8080');

  const quake$ = Observable.fromEvent(ws, 'message')
    .flatMap(quakesObj => {
      const { quakes } = JSON.parse(quakesObj);

      return Observable.from(quakes);
    })
    .map(quake => {
      const { lng, lat } = quake;
      const coords = [ lng - 0.3, lat - 0.15, lng + 0.3, lat + 0.15 ];

      return coords.map(c => c.toString().match(/\-?\d+(\.\-?\d{2})?/)[0]);
    })
    .filter((boundary, i) => i < 50)
    .map(boundary => boundary)
    .subscribe(location => {
      const T = new Twit({
        consumer_key: process.env.CLANG_TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.CLANG_TWITTER_CONSUMER_SECRET,
        access_token: process.env.CLANG_TWITTER_TOKEN_KEY,
        access_token_secret: process.env.CLANG_TWITTER_TOKEN_SECRET
      });

      const stream = T.stream('statuses/filter', {
        track: 'earthquake',
        locations: location,
      });

      stream.on('tweet', data => {
        ws.send(JSON.stringify(data), err => {
          if (err) {
            console.log('There was an error sending the message');
          } else {
            console.log(data.text);
          }
        });
      });
  });
}

const Server = new WebSocketServer({ port: 8080 });

Observable.fromEvent(Server, 'connection')
  .subscribe(onConnect);