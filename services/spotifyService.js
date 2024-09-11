const { getAccessToken } = require('./spotifyAuthService');
const axios = require('axios');

async function getAllSpotifyPlaylists() {
  const accessToken = await getAccessToken();
  let offset = 0;
  let allPlaylists = [];
  let response;
  do {
    response = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      params: {
        limit: 50,
        offset: offset
      }
    });

    allPlaylists = allPlaylists.concat(response.data.items);
    offset += 50;
  } while (response.data.next);
  return allPlaylists;
}

async function getSpotifyPlaylistItems(listId) {
  const accessToken = await getAccessToken();
  let offset = 0;
  let allSongs = [];
  let response;
  const listUrl = `https://api.spotify.com/v1/playlists/${listId}/tracks`;
  do {
    response = await axios({
      method: 'get',
      url: listUrl,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      params: {
        limit: 20,
        offset: offset
      }
    });

    allSongs = allSongs.concat(response.data.items);
    offset += 20;
  } while (response.data.next);
  return allSongs;
}


async function uploadSpotifyPlaylist() {
  // const track = ['34IWTZFqYOYybm0U7mP6Bx', '2CdtNHhb3poUJp7s0VTWFc', '3MnEJjjLF03DwVD9pDHYZt', '7cBpYqkLiEPKuWeDj1zok9', '1wlVg63NM3xaz7fRAep333', '6wtgkLjDUAZIw94GK57DxN', '4cSHAkVFFjkH0KwMPcFcwC', '1HsUn7QMu5SRtXuha3ObiS', '0MUciPE5Nf5fKzi9lE9O52', '23OA6lzK5yPbQXIyMT7RIv', '6hQFxDkmoI8zVqbl7rHSEC', '3BA8nyPfmVVfHK0nK4b2gu', '2nAWEO2X6SxkHwPPqZaHXK', '31a7oPcfP9dRQxKiMB18AM', '27K0Z5zfxes9TRGC74asiH', '7sT9WfrxUDD6pPbPAGcL68', '4kPKMcH4b7Vs2VUtOiKHtx', '1yFAcKMwr6ZofFSKebnm5Z', '5jLpmt8McXCc5O4REQUNZT', '3kSUEJyFYSYiPtorfyqZUu', '6LompZIWUrLUFwip9ux3n9', '1rAkfsz76armNeQ9R1Y7vA', '1cWnsmLzof6vJmWQdB2v8C', '3n8rPKNitxjNZlmoACWOu1', '7imj8Rgt6JjlZtoRwv3dgl', '5xmqRsYF4oIv0AerCRwJrL', '4YAr6Ocsi7UAyHaDXFumLY', '0lyKUoqQNew3J1lgIz9nZD', '2JOr15qPbofRzOYx23Pbdx', '4fIi5Ve2FgsKlEWI7ANoKs', '15bR9os2Nz2eiiibdt2lkS', '2WUxBzMk1HOoVRGyBXPJH7', '0sXvA2cXXX62BwKgZyUEKC'];
  // const prefix = 'spotify:track:';
  // const trackIds = track.map(item => prefix + item);
  // try {
  //   let count = 0;
  //   while (trackIds.length > 0) {
  //     const tracksToUpload = trackIds.splice(count, count + 100);
  //     const response = await axios({
  //       method: 'post',
  //       url: `https://api.spotify.com/v1/playlists/4JM8aAo9odEJ7Q3avaaN8w/tracks?uris=${tracksToUpload}`,
  //       headers: {
  //         'content-type': 'application/json',
  //         'Authorization': 'Bearer ' + global.accessToken
  //       }
  //     });
  //     await new Promise(resolve => setTimeout(resolve, 2000));
  //   }

  //   res.redirect('/tools.html');
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ error: err }); // Return the error as JSON
  // }
}


module.exports = {
  getAllSpotifyPlaylists,
  getSpotifyPlaylistItems,
  uploadSpotifyPlaylist
}
