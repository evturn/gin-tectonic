import { Server as WebSocketServer } from 'ws';
import T from './credentials';
import { Observable } from 'rx';

function onConnect(ws) {
  console.log('Somebody here.');

  Observable.fromEvent(ws, 'message')
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
      const stream = T.stream('statuses/filter', {
        track: 'earthquake',
        locations: location,
      });

      const tweet$ = Observable.fromEvent(stream, 'tweet')
      const connected$ = Observable.fromEvent(stream, 'connected')

      connected$.subscribe(
        () => console.log('Connection to Twitter Established (in 2008 LoLz!)')
      );

      tweet$.flatMap(data => Observable.from(parseTweet(data)))
        .distinct(data => data.text)
        .subscribe(data => {
          ws.send(JSON.stringify(data), err => {
            err ? console.log(`We got problems ${err}`) : console.log(data.text);
          });
        });
  });
}

function parseTweet(data) {
  const {
    user: { profile_image_url, screen_name },
    text, created_at
  } = data;
  const [ firstChar ] = text;
  const date = new Date(created_at);
  const isClean = (
    !text.includes('RT') &&
    !text.includes('http') &&
    firstChar !== '@' &&
    firstChar !== '#' &&
    firstChar !== '.' &&
    firstChar !== '[' &&
    firstChar !== '-' &&
    firstChar !== '<'
  );

  if (isClean) {
    return [{
      text,
      name: screen_name,
      avatar: profile_image_url,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }];
  } else {
    return [];
  }
}

const Server = new WebSocketServer({ port: 8080 });

Observable.fromEvent(Server, 'connection')
  .subscribe(onConnect);