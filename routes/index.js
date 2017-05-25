var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/api/bills', function(req, res) {    
  connection.query('SELECT * FROM Legislation L JOIN LegislationInfo LI ON L.LegislationInfo_idLegislationInfo = LI.idLegislationInfo WHERE L.LegalTitle IS NOT NULL AND L.Sponsor IS NOT NULL AND L.LongDescription IS NOT NULL GROUP BY L.LegalTitle', function(err, results){
      if(err) {
          throw err;
      }else{
          res.json(results);
      }
  });
});

router.post('/api/bills/*', function(req, res) {

  connection.query('SELECT * FROM LegislationInfo LI JOIN RollCall RC ON LI.idLegislationInfo = RC.LegislationInfo_idLegislationInfo JOIN Legislation L ON L.LegislationInfo_idLegislationInfo = LI.idLegislationInfo JOIN Vote V ON RC.idRollCall = V.RollCall_idRollCall JOIN Sponsor S ON S.idSponsor = V.Sponsor_idSponsor WHERE LI.BillID = ?', req.body.BillID, function(err, results){
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

router.post('/api/politicians/*', function(req, res) {

  connection.query('SELECT * FROM Sponsor S JOIN Sponsor_Committee SC ON S.idSponsor = SC.Sponsor_idSponsor JOIN Committee C ON SC.Committee_idCommittee = C.idCommittee WHERE S.idSponsor = ?', req.body.idSponsor, function(err, results){
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
