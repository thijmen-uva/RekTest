const express = require('express')
const app = express()
const path = require('path')

const axios = require('axios')

const { Buffer } = require('node:buffer')
const dotenv = require('dotenv').config()

const bodyParser = require('body-parser');
const { URLSearchParams } = require('node:url')
var crypto = require('crypto')
var querystring = require('querystring')
const cookieParser = require('cookie-parser')
const spotify = require('./Spotify.js');
const { url } = require('inspector')
const { glob } = require('fs')
const { log } = require('console')
const sqlite3 = require('@journeyapps/sqlcipher').verbose();

const callback = 'http://localhost:5173/callback'
var stateKey = 'spotify_auth_state'
const scope = 'playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private user-library-modify user-read-recently-played'

const generateRandomString = length => {
  return crypto.randomBytes(60).toString('hex').slice(0, length)
}

function fetchLoginUrl(state) {
  const url = new URL('https://accounts.spotify.com/authorize')
  const data = {
    client_id: process.env.CLIENT_ID,
    response_type: 'code',
    redirect_uri: callback,
    state: state,
    scope: scope
  }
  url.search = new URLSearchParams(data).toString();
  return url
}

// sendFile will go here
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')))
app.use(cookieParser())


async function login(req, res) {
  global.referer = req.get('Referer');
  var state = generateRandomString(16)
  res.cookie(stateKey, state)
  res.redirect(fetchLoginUrl(state))
  return state
}

app.get('/login', async function (req, res) {
  await login(req, res)
})

app.get('/callback', function (req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      data: querystring.stringify({
        'code': code,
        'redirect_uri': callback,
        'grant_type': 'authorization_code'
      })
    })
      .then(response => {
        global.access_token = response.data["access_token"];
        global.refresh_token = response.data["refresh_token"];
        global.expire_time = Date.now() + response.data["expires_in"] * 1000;
        global.isAuthenticated = true;
        res.redirect(global.referer + '#' + 
          querystring.stringify({
            access_token: response.data["access_token"],
            refresh_token: response.data["refresh_token"]

          }));
      })
      .catch(err => {
        global.isAuthenticated = false;
        res.redirect('/#' +
          querystring.stringify({
            error: err
          }));
      });

  }
});

app.get('/refresh_token', function (req, res) {
  refresh_token(res);
});

async function authenticate(req, res) {
  console.log("auth");
  console.log(global.access_token);
  await login(req, res);
  sleep(2000);
  // Get the referer header
  const referer = req.get('Referer');
  console.log("Came from:", referer);

  if (!global.access_token) {
    console.log("no access token");
    await res.redirect('/login');
    return; // Ensure the function exits after redirecting
  }
  if (Date.now() < global.expire_time - 30000) {
    console.log("token not expired");
    return;
  } else {
    await refresh_token();
  }
}


app.get('/upload_playlist', async function (req, res) {
  const track = ['34IWTZFqYOYybm0U7mP6Bx', '2CdtNHhb3poUJp7s0VTWFc', '3MnEJjjLF03DwVD9pDHYZt', '7cBpYqkLiEPKuWeDj1zok9', '1wlVg63NM3xaz7fRAep333', '6wtgkLjDUAZIw94GK57DxN', '4cSHAkVFFjkH0KwMPcFcwC', '1HsUn7QMu5SRtXuha3ObiS', '0MUciPE5Nf5fKzi9lE9O52', '23OA6lzK5yPbQXIyMT7RIv', '6hQFxDkmoI8zVqbl7rHSEC', '3BA8nyPfmVVfHK0nK4b2gu', '2nAWEO2X6SxkHwPPqZaHXK', '31a7oPcfP9dRQxKiMB18AM', '27K0Z5zfxes9TRGC74asiH', '7sT9WfrxUDD6pPbPAGcL68', '4kPKMcH4b7Vs2VUtOiKHtx', '1yFAcKMwr6ZofFSKebnm5Z', '5jLpmt8McXCc5O4REQUNZT', '3kSUEJyFYSYiPtorfyqZUu', '6LompZIWUrLUFwip9ux3n9', '1rAkfsz76armNeQ9R1Y7vA', '1cWnsmLzof6vJmWQdB2v8C', '3n8rPKNitxjNZlmoACWOu1', '7imj8Rgt6JjlZtoRwv3dgl', '5xmqRsYF4oIv0AerCRwJrL', '4YAr6Ocsi7UAyHaDXFumLY', '0lyKUoqQNew3J1lgIz9nZD', '2JOr15qPbofRzOYx23Pbdx', '4fIi5Ve2FgsKlEWI7ANoKs', '15bR9os2Nz2eiiibdt2lkS', '2WUxBzMk1HOoVRGyBXPJH7', '0sXvA2cXXX62BwKgZyUEKC'];
  const prefix = 'spotify:track:';
  const track_ids = track.map(item => prefix + item);
  try {
    let count = 0;
    while (track_ids.length > 0) {
      const tracksToUpload = track_ids.splice(count, count + 100);
      const response = await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/playlists/4JM8aAo9odEJ7Q3avaaN8w/tracks?uris=${tracksToUpload}`,
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + global.access_token
        }
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    res.redirect('/tools.html');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err }); // Return the error as JSON
  }
});

app.get('/get_all_user_playlists', async function (req, res) {
  try {
    let offset = 0;
    let allPlaylists = [];
    let response;
    do {
      response = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + global.access_token
        },
        params: {
          limit: 50,
          offset: offset
        }
      });

      allPlaylists = allPlaylists.concat(response.data.items);
      offset += 50;
    } while (response.data.next);

    res.json(allPlaylists); // Return all playlists as JSON
  } catch (err) {
    console.error(err); // Log the entire error for debugging
    res.status(err).json({ error: err }); // Return the error as JSON
  }
});


async function Get_spotify_playlist_items(listId, res = null)
{
  console.log("Get_spotify_playlist_items");
  try {
    let offset = 0;
    let allSongs = [];
    let response;
    console.log(listId);
    const listurl = `https://api.spotify.com/v1/playlists/${listId}/tracks`;
    do {
      response = await axios({
        method: 'get',
        url: listurl,
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + global.access_token
        },
        params: {
          limit: 20,
          offset: offset
        }
      });

      allSongs = allSongs.concat(response.data.items);
      offset += 20;
    } while (response.data.next);

    if (res) res.json(allSongs); // Return all Songs as JSON
    return allSongs; // Return all Songs as JSON
  } catch (err) {
    console.error(err.response.data.error); // Log the entire error for debugging
    const status = err.response ? err.response.status : 500;
    const error = err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Internal Server Error';
    if (res) res.status(status).json({ error: error }); // Return the error as JSON
    return { status: status, error: error }; // Return the error as JSON
  }
}

async function Get_rekordbox_playlist_items(listId, res)
{
  try {
    const db = new sqlite3.Database('master.db');
    db.serialize(function () {

      db.run("PRAGMA cipher_compatibility = 4");

      db.run("PRAGMA key = '402fd482c38817c35ffa8ffb8c7d93143b749e7d315df7a81732a1ff43608497'");

      db.all("SELECT * FROM djmdPlaylist WHERE ", (err, tables) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ tables });
      });
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

app.get('/get_spotify_playlist_items/:listId', async function (req, res) {
  try {
    const listId = req.params.listId;
    let offset = 0;
    let allSongs = [];
    let response;
    console.log(listId);
    const listurl = `https://api.spotify.com/v1/playlists/${listId}/tracks`;
    do {
      response = await axios({
        method: 'get',
        url: listurl,
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + global.access_token
        },
        params: {
          limit: 20,
          offset: offset
        }
      });

      allSongs = allSongs.concat(response.data.items);
      offset += 20;
    } while (response.data.next);

    res.json(allSongs); // Return all Songs as JSON
  } catch (err) {
    console.error(err.response.data.error); // Log the entire error for debugging
    const status = err.response ? err.response.status : 500;
    const error = err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Internal Server Error';
    res.status(status).json({ error: error }); // Return the error as JSON
  }
});

app.get('/get_spotify_playlist_items/:listId', async function (req, res) {
    if (!global.isAuthenticated) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const listId = req.params.listId;
    if (!listId) {
      res.status(400).json({ error: 'Invalid request: Must provide a playlist ID' });
      return;
    }
    const response = await Get_spotify_playlist_items(listId);
    console.log(response);
    if (response) { 
      res.json(JSON.stringify(response));
      return;
    }
});

app.get('/get_rekordbox_data', async function (req, res) {
  try {
    const db = new sqlite3.Database('master.db');
    db.serialize(function () {

      db.run("PRAGMA cipher_compatibility = 4");

      db.run("PRAGMA key = '402fd482c38817c35ffa8ffb8c7d93143b749e7d315df7a81732a1ff43608497'");

      db.all("SELECT * FROM djmdPlaylist", (err, tables) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ tables });
      });
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/sync_spotify_to_rekordbox', async function (req, res) {
  const { spotify_playlist, rekordbox_playlist } = req.body;
  if (!spotify_playlist || !rekordbox_playlist) {
    res.status(400).json({ error: 'Invalid request: Must select at least 2 lists!' });
    return;
  }
  if (!global.isAuthenticated) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  var spotify_tracks_json = await Get_spotify_playlist_items(spotify_playlist['id']);
  var rekordbox_tracks_json = await Get_rekordbox_playlist_items(rekordbox_playlist['id']);
  var i = 0;
  var spotify_tracks = [];
  for (const song of test)
  {
    i++;
    spotify_tracks.push(song['track']['artists'][0].name, song['track']['name']);
  }
   
  res.json({ message: 'Data received successfully' });
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/images', function (req, res) {
  res.sendFile(path.join(__dirname, '/images'))
})

app.get('/tools.html', function (req, res) {
  res.sendFile(path.join(__dirname, '/tools.html'));
});

app.get('/sync.html', function (req, res) {
  res.sendFile(path.join(__dirname, '/sync.html'));
});

app.get('/is_logged_in', function (req, res) { 
  res.json({ logged_in: global.isAuthenticated }); 
}); 

app.listen(5173, () => {
  global.isAuthenticated = false;
  console.log('Server is running on http://localhost:5173')
})
