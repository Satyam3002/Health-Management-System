require('dotenv').config();

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const sid = process.env.TWILIO_ACCOUNT_SID;
const key = process.env.TWILIO_API_KEY;
const secret = process.env.TWILIO_API_SECRET;

function createToken(identity, room) {
  const token = new AccessToken(
    sid,
    key,
    secret,
    { identity: identity } 
  );

 
  const grant = new VideoGrant();
  grant.room = room; 
  token.addGrant(grant);

  return token.toJwt();
}

module.exports = createToken;
