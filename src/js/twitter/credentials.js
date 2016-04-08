import Twit from 'twit';

const T = new Twit({
  consumer_key: process.env.CLANG_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.CLANG_TWITTER_CONSUMER_SECRET,
  access_token: process.env.CLANG_TWITTER_TOKEN_KEY,
  access_token_secret: process.env.CLANG_TWITTER_TOKEN_SECRET
});

export default T;