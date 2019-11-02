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

// // AWS RDS POSTGRESQL INSTANCE
// // var db_credentials = new Object();
// // db_credentials.user = 'aaron';
// // db_credentials.host = process.env.AWSRDS_EP;
// // db_credentials.database = 'mydb';
// // db_credentials.password = process.env.AWSRDS_PW;
// // db_credentials.port = 5432;

// var index = 0;
// var fns = '/home/ec2-user/environment/data/temp.txt'

var data = {};

var getAndWriteData = function() {
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        
        // Store sensor value(s) in a variable
        var parseJson = JSON.parse(body);
        
        data.temperature = parseFloat(parseJson.result);

        
        // var temperature = {};
        // // data.hour = 12;
        // temperature = parseFloat(parseJson.result);
        
        // data.push(temperature);
        
        // var testArray = [];
        
        // var sv = {};
        
        // var tempValue = {};
        
        // tempValue = body.sv.result;
        
        // testArray.push(tempValue);
        
        // console.log(sv);
        
        // console.log("hello");

        
        // Convert 1/0 to TRUE/FALSE for the Postgres INSERT INTO statement
        // var sv_mod; 
        // if (sv == 1) {
        //     sv_mod = "TRUE";
        // }
        // else if (sv == 0) {
        //     sv_mod = "FALSE";
        // }

        // // Connect to the AWS RDS Postgres database
        // const client = new Client(db_credentials);
        // client.connect();

        // // Construct a SQL statement to insert sensor values into a table
        // var thisQuery = "INSERT INTO sensorData VALUES (" + sv_mod + ", DEFAULT);";
        // console.log(thisQuery); // for debugging

        // // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        // client.query(thisQuery, (err, res) => {
        //     console.log(err, res);
        //     client.end();
        // });
    });
};

// console.log(parseJson);


// write a new row of sensor data every five minutes
// setInterval(getAndWriteData, 300000);
