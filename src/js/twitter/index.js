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

  Observable.fromEvent(ws, 'message')
    .flatMap(quakesObj => {
      const { quakes } = JSON.parse(quakesObj);

      return Observable.from(quakes);
    })
    .scan((boundsArray, quake) => {
      const { lng, lat } = quake;
      const bounds = [
        lng - 0.3,
        lat - 0.15,
        lng + 0.3,
        lat + 0.15
      ].map(coordinate => {
        coordinate = coordinate.toString();

        return coordinate.match(/\-?\d+(\.\-?\d{2})?/)[0];
      });

      boundsArray.concat(bounds);

      return boundsArray.slice(Math.max(boundsArray.length - 50, 0))
    })
    .subscribe(boundsArray => {
      console.log(stream);
      stream.stop();
      stream.params.locations = boundsArray.toString();
      stream.start();
    });
}

const Server = new WebSocketServer({ port: 8080 });

Observable.fromEvent(Server, 'connection')
  .subscribe(onConnect);