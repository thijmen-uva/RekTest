const express = require('express')
const app = express()
const path = require('path')

const dotenv = require('dotenv').config()

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser')

const spotifyAuthroutes = require('./spotifyAuthController');
const spotifyRoutes = require('./spotifyController');
const rekordboxRoutes = require('./rekordboxController');
const syncRoutes = require('./syncController');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')))
app.use(cookieParser())

app.get('/controllers', function (req, res) {
  res.sendFile(path.join(__dirname, '/controllers'))
})

app.use('/', spotifyAuthroutes)
app.use('/', spotifyRoutes)
app.use('/', rekordboxRoutes)
app.use('/', syncRoutes);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})


app.get('/images', function (req, res) {
  res.sendFile(path.join(__dirname, '/images'))
})

app.get('/tools.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages/tools.html'));
});

app.get('/sync.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'pages/sync.html'));
});

app.listen(5173, () => {
  console.log('Server is running on http://localhost:5173')
})
