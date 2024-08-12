const express = require('express');
const router = express.Router();

// Define a route to handle GET requests
router.get('/get_rekordbox_data', async function (req, res) {
    try {
        // Your logic to get rekordbox data
        const rekordboxData = []; // Replace with actual logic to get rekordbox data
        res.json(rekordboxData); // Return rekordbox data as JSON
    } catch (err) {
        console.error(err.response.data.error); // Log the entire error for debugging
        const status = err.response ? err.response.status : 500;
        const error = err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Internal Server Error';
        res.status(status).json({ error: error }); // Return the error as JSON
    }
});

module.exports = router;