//dependencies
const dotenv = require('dotenv');
const async = require ("async"); 
const { Client } = require('pg');
const fs = require('fs');

dotenv.config();

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'jcoutwater';
db_credentials.host = 'database-cook.chulj8yx5mea.us-east-1.rds.amazonaws.com';
db_credentials.database = 'cook';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE sensorData;";

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData (  sensorIndex varchar(10),\
                                            sensorYear varchar(10),\
                                            sensorMonth varchar(5),\
                                            sensorDay varchar(5),\
                                            sensorTime time,\
                                            sensorTimeRaw varchar(20),\
                                            sensorValue double precision);";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
