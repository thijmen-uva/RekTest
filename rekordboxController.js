const express = require('express');
const router = express.Router();

const { getAllRekordboxPlaylists, getRekordboxPlaylistById } = require('./services/rekordboxService');

router.get('/get_rekordbox_data', async function (req, res) {
    try {
        const tracks = await getAllRekordboxPlaylists();
        res.json(tracks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;