const express = require('express');
const router = express.Router();

const { getAllSpotifyPlaylists, getSpotifyPlaylistItems, uploadSpotifyPlaylist } = require('./services/spotifyService');

router.get('/get_all_user_playlists', async function (req, res) {
    try {
        const items = await getAllSpotifyPlaylists();
        res.json(items)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

router.get('/get_spotify_playlist_items/:listId', async function (req, res) {
    try {
        const items = await getSpotifyPlaylistItems(req.params.listId);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }

});

router.get('/upload_playlist', async function (req, res) {
    await upload_playlist(req.query.playlist_id);
});

module.exports = router;