var mysql = require('mysql');
var secrets = require('../config/secrets.json');
var connection = mysql.createConnection({
    host     : secrets.databaseAuth.host,
    port     : secrets.databaseAuth.port,
    user     : secrets.databaseAuth.user,
    password : secrets.databaseAuth.password,
    database : secrets.databaseAuth.database
    });

connection.connect(function(err){

if(!err) {
    console.log("Database is connected ... ");    
} else {
    console.log("Error connecting database ... ");    
}
});