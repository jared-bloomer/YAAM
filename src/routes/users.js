const express = require('express')
const router = express.Router()

const config = require('config');
const passport = require('passport');
const db = require('../controllers/db');

// Required for header
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

// define the users page route
router.get("/users", function (req, res, next) {
    res.redirect('/users/list');
});

router.get('/users/list', async function (req, res, next) {
  res.locals.allUsers = await db.getAllUsers();
  res.render('listusers', {
    subject: 'This is the user management portal',
    name: 'YAAM Users',
    link: 'https://google.com',
    callsign: callsign,
    callsign_name: callsign_name,
    website: website,
    location: location,
    grid_square: grid_square,
    getUsers: res.locals.allUsers
  });
});


module.exports = router