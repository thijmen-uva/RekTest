const express = require('express');
const router = express.Router();

const querystring = require('querystring');
const { refresh_token, getLoginUrl, authenticate, getAccessToken, isLoggedin} = require('./services/spotifyAuthService');

const stateKey = 'spotify_auth_state';

router.get('/is_logged_in', async function (req, res) { 
    res.json({ logged_in:  await isLoggedin() }); 
}); 

router.get('/refresh_token', function (req, res) {
    refresh_token(res);
});

router.get('/login', function (req, res) {
    // if (global.isAuthenticated) {
        //     res.redirect('/#');
        // }
        global.referer = req.get('Referer');
    const { url, state } = getLoginUrl(stateKey);
    res.cookie(stateKey, state)
    res.redirect(url);
});

router.get('/callback', async function (req, res) {
    try {
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
            const response = await authenticate(code);
            res.redirect(global.referer + '#' +
                querystring.stringify({
                    access_token: response['access_token'],
                    refresh_token: response['refresh_token'],
                    
                }));
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

router.get('/get_access_token', async function (req, res) {
    try {
        await getAccessToken();
        res.status(200).json({ access_token: global.access_token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }

});

module.exports = router;