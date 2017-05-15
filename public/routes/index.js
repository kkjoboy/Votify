var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/api/bills', function(req, res) {    
  connection.query('SELECT * FROM Legislation', function(err, results){
      if(err) {
          throw err;
      }else{
          res.json(results);
      }
  });
});

router.get('/api/politicians', function(req, res) {    
  connection.query('SELECT * FROM Sponsor', function(err, results){
      if(err) {
          throw err;
      }else{
          res.json(results);
      }
  });
});

router.get('*', function(req, res) {
  res.render('index');
});

module.exports = router;
