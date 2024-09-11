

const { getPlaylistById, getAllSongs } = require('../Rekordbox-js/rekordbox');
const { getAllSpotifyPlaylists, getSpotifyPlaylistItems, uploadSpotifyPlaylist } = require('./spotifyService');
const rb = require('../Rekordbox-js/rekordbox');
const { all } = require('axios');
const Fuse = require('fuse.js');

const fuseOptions = {
  isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.5,
  // distance: 100,
  useExtendedSearch: true,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    "Title",
  ]
};

function compareTrack(spotify_track, rekordbox_track) {
  return spotify_track.Title === rekordbox_track.Title && spotify_track.Artist === rekordbox_track.Artist;
}

function fuzzyMatchLists(spotify_list, rekordbox_list) {
  const fuse = new Fuse(rekordbox_list, fuseOptions);
  var list = [];
  var notfound = [];
  for (const track of spotify_list) {
    const result = fuse.search(track.Title);
    if (result.length > 0) {
      list.push(result[0].item);
    } else {
      notfound.push(track);
    }
    
  }
  console.log(notfound);
  console.log(list.length);
  return list;
}

async function syncSpotifyToRekorbox(spotify_playlist, rekordbox_playlist) {
  var spotify_tracks_json = await getSpotifyPlaylistItems(spotify_playlist.id);
  var rekordbox_tracks_json = await rb.getPlaylistItems(rekordbox_playlist.ID);
  const spotify_tracks = spotify_tracks_json.map(track => {
    return {
      Title: track.track.name + ' ' + track.track.artists.map(artist => artist.name).join('|'),
      ID: track.track.id
    }
  });

  const rekordbox_tracks = rekordbox_tracks_json.map(track => {
    return {
      Title: track.Content.Title,
      Artist: track.Content.Artist.Name,
      ID: track.Content.ID
    }
  });

  const tracks_to_add = spotify_tracks.filter(spotify_track => !rekordbox_tracks.some(rekordbox_track => compareTrack(spotify_track, rekordbox_track)));
  var missing_tracks = [];
  console.log("Total tracks to be added: ", tracks_to_add.length);
  var rekordbox_track = null;
  var count = 0;
  var added_tracks = [];
  const all_tracks = await rb.getAllSongs();

  const test = all_tracks.map(t => ({ Title: t.Title + ' ' + (t.Artist && t.Artist.Name ? t.Artist.Name : ''), ID: t.ID }));
  const list_to_add = fuzzyMatchLists(spotify_tracks, test);

  console.log(list_to_add);

  // for (const track of tracks_to_add) {
  //   // console.log("Title: ", track.Title, "Artist: ", track.Artist);
  //   rekordbox_track = await rb.searchContents(track.Title, track.Artist);
  //   // console.log(rekordbox_track);
  //   // await sleep(2000);
  //   if (!rekordbox_track) {
  //     console.log("\x1b[31m%s\x1b[0m", "Track not found in rekordbox: ", track.Title);
  //     missing_tracks.push(track);
  //     continue;
  //   }

  //   // console.log(rekordbox_track);
  //   console.log("\x1b[32m%s\x1b[0m", "Adding track: ", rekordbox_track.Title);
  //   added_tracks.push(rekordbox_track.ID);
  //   count++;
  // }

  // console.log("Total tracks found: ", count);
  // console.log("\x1b[31m%s\x1b[0m", "Tracks not found in rekordbox: ", missing_tracks);
  
  for (const track of list_to_add) {
    console.log("Adding ID: ", track.ID);
    await rb.addToPlaylist(rekordbox_playlist.ID, track.ID);

  }

};


module.exports = { syncSpotifyToRekorbox };


