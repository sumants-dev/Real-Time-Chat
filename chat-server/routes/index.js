var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.post('/user', (req, res, next) => {
  console.log(req.body)
  const { user } = req.body
  console.log(user)
  req.session.user = user
  res.status(200).send()
})

router.get('/logged', (req, res, next) => {
  res.send(req.session.user !== null)
})

router.get('/user', (req, res, next) => {
  console.log('')
  if (req.session.user === null) {
    res.send(null)
  }
  console.log(req.session.user)

  res.send(req.session.user)
})

module.exports = router;
