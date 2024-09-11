const express = require('express');
const router = express.Router();

const { syncSpotifyToRekorbox } = require('./services/syncService');

router.post('/sync_spotify_to_rekordbox', async function (req, res) {
    const { spotify_playlist, rekordbox_playlist } = req.body;
    if (!spotify_playlist || !rekordbox_playlist) {
        res.status(400).json({ error: 'Invalid request: Must select at least 2 lists!' });
        return;
    }
    try {
        await syncSpotifyToRekorbox(spotify_playlist, rekordbox_playlist);
        res.status(200).json({ message: 'Sync completed!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;