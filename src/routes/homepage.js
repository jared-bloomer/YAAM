const express = require('express')
const router = express.Router()

const config = require('config');

const callsign = config.get('node.callsign');
const callsign_name = config.get('node.callsign_name');
const website = config.get('node.website');
const location = config.get('node.location');
const grid_square = config.get('node.grid_square');


// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.render('index', {
    subject: 'This is the homepage',
    name: 'YAAM template',
    link: 'https://google.com',
    callsign: callsign,
    callsign_name: callsign_name,
    website: website,
    location: location,
    grid_square: grid_square
  });
});

module.exports = router