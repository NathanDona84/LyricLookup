const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require('spotify-web-api-node');
const apiseeds = require("apiseeds-lyrics");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) =>{
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: 'http://localhost:3000',
      clientId: '9e4da4d22c754a95860f01b0d9423ead',
      clientSecret: '0f658fe388614000b5e8ed4f02459035',
      refreshToken 
  })

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in
      })
    }).catch(() => {
      res.sendStatus(400);
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '9e4da4d22c754a95860f01b0d9423ead',
        clientSecret: '0f658fe388614000b5e8ed4f02459035'
    })
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        })
      })
      .catch(err => {
        res.sendStatus(400)
      })
})

app.get("/lyrics", async (req, res) => {
  let lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  // apiseeds.getLyric('2b815cGbv4QudRfl1KVaLuzBrCDbMwZJOSsXYQq3XQhm9LEZ9dfps2Q1',req.query.artist, req.query.track, (res) => {
  //   console.log(res);
  //   lyrics = res;
  // })
  res.json({ lyrics })
})

app.listen(3001);