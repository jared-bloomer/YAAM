const express = require('express')
const router = express.Router()

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
    link: 'https://google.com'
  });
});

module.exports = router