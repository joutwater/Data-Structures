// dependencies
var request = require('request');
const { Client } = require('pg');
var async = require('async'); // npm install async
var fs = require('fs');
const dotenv = require('dotenv'); // npm install dotenv
dotenv.config();

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'tempsensor';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'jcoutwater';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'cook';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var data = {};
var index = 0;

var getAndWriteData = function() {
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        
        // Store sensor value(s) in variables
        var parseJson = JSON.parse(body);
        var rawTime = parseJson.coreInfo.last_heard.split('T');
        var splitTime = rawTime[0].split(/-/);
        
        data.id = index;
        data.year = splitTime[0];
        data.month = splitTime[1];
        data.day = splitTime[2];
        data.time = rawTime[1].slice(0,5);
        data.rawStamp = rawTime[1];
        data.temperature = parseJson.result;
        
        index++;
        
        // console.log(data);


        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO sensorData VALUES ('" + data.id + "',\
                                                        '" + data.year + "',\
                                                        '" + data.month + "',\
                                                        '" + data.day + "',\
                                                        '" + data.time + "',\
                                                        '" + data.rawStamp + "',\
                                                        '" + data.temperature + "');";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// check function discretely
// getAndWriteData();
// console.log(data);


// write a new row of sensor data every five minutes
setInterval(getAndWriteData, 300000);
