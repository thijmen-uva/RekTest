const rb = require('../Rekordbox-js/rekordbox.js');

async function getAllRekordboxPlaylists() {
    return await rb.getAllPlaylists();
}

async function getRekordboxPlaylistById(id) {
    return await rb.getPlaylistById(id);
}

function compare_track(spotify_track, rekordbox_track) {
  return spotify_track.Title === rekordbox_track.Title && spotify_track.Artist === rekordbox_track.Artist;
}

module.exports = {
    getAllRekordboxPlaylists,
    getRekordboxPlaylistById,
    
}