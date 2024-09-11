const { URLSearchParams } = require('node:url');
var crypto = require('crypto');
const { Buffer } = require('node:buffer');
const axios = require('axios');
const querystring = require('querystring');

const callback = 'http://localhost:5173/callback'
const scope = 'playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private user-library-modify user-read-recently-played'

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

const generateRandomString = length => {
    return crypto.randomBytes(60).toString('hex').slice(0, length)
}

function getLoginUrl() {
    var state = generateRandomString(16)
    return { url: fetchLoginUrl(state), state: state};
}

async function authenticate(code) {
    const response = await axios({
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
    });
    global.access_token = response.data.access_token
    global.refresh_token = response.data.refresh_token
    global.expire_time = Date.now() + response.data.expires_in * 999;
    return response.data;
};

async function refresh_token(res) {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        data: querystring.stringify({
            'client_id': process.env.CLIENT_ID,
            'refresh_token': global.refresh_token,
            'grant_type': 'refresh_token'
        })
    });
    global.access_token = response.data.access_token
    global.refresh_token = response.data.refresh_token
    global.expire_time = Date.now() + response.data.expires_in * 999;
    return response.data;
}

async function isLoggedin() {
    if (!global.refresh_token) {
        return false;
    }
    if (global.expire_time < Date.now()) {
        await refresh_token(global.refresh_token);
    }
    return true;
}

async function getAccessToken() {
    if (!global.access_token) {
        await login();
    }
    if (global.expire_time < Date.now()) {
        await refresh_token(global.refresh_token);
    }
    return global.access_token;
}

module.exports = { getAccessToken, getLoginUrl, authenticate, isLoggedin };