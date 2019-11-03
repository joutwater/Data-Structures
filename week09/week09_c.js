// dependencies
var request = require('request');
const { Client } = require('pg');
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv
dotenv.config();


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'jcoutwater';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'cook';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statements for checking your work: 
var thisQuery = "SELECT * FROM sensorData;"; // print all values
var secondQuery = "SELECT COUNT (*) FROM sensorData;"; // print the number of rows
var thirdQuery = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;"; // print the number of rows for each sensorValue

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
});

client.query(secondQuery, (err, res) => {
    console.log(err, res.rows);
});

client.query(thirdQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});
