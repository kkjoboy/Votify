// DATABASE CONNECTION
// ===========================================================================================

var mysql = require('mysql');
var secrets = require('./secrets.json');
var connection = mysql.createConnection({
    host     : secrets.databaseAuth.host,
    port     : secrets.databaseAuth.port,
    user     : secrets.databaseAuth.user,
    password : secrets.databaseAuth.password,
    database : secrets.databaseAuth.database
    });

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected at " + secrets.databaseAuth.host + " on port " + secrets.databaseAuth.port);    
    } else {
        console.log("Error connecting to the database.");    
    }
});

// DATABASE QUERY
// ===========================================================================================

// var queryString = 'SELECT * FROM Amendments';
 
// connection.query(queryString, function(err, rows, fields) {
//     if (err) throw err;
 
//     for (var i in rows) {
//         console.log('Post Amendments: ', rows[i].BillID);
//     }
// });

module.exports = connection;