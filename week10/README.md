# Week 10 Assignment
## Creating an endpoint for three different databases

In this week's [assignment](https://github.com/visualizedata/data-structures/tree/master/weekly_assignment_10), students are tasked with getting the final interfaces one step closer by creating an endpoint for the AA Meetings, Sensor Data, and Process Blog databases. The specific queries I've used in the endpoint show some of the data that I plan to inlcude in each of the interfaces.

### Part One: Connecting to databases, querying from databases, and hosting on web app

The first step in creating the endpoints is correctly organizing all of the credentials for each database so that we can connect and access the data. I went back to the weekly assignments for the three databases I created and brought the credentials and specific query information to the app.js code. During the class session where we pariticpated in the exercise to practice express, Robin, Saloni, and I created a system of pushing queried SQL information to an array, and then using res.send to get that data to its particular link in the web app. Following this method, I attributed the same approach to the other databases that we did not get to querying in class. After making some changes to the code allowing connection to the correct databases, the web app finally came together! Please see code below with comments.

    var express = require('express'), // npm install express
        app = express();
    var dotenv = require('dotenv');
        dotenv.config();
        const { Client } = require('pg');
        var fs = require('fs');
        const async = require ("async"); 

    var AWS = require('aws-sdk');
        AWS.config = new AWS.Config();
        AWS.config.region = "us-east-1";

        //credentials for AA data
        var db_credentials = new Object();
        db_credentials.user = 'jcoutwater';
        db_credentials.host = 'database-structures-1.chulj8yx5mea.us-east-1.rds.amazonaws.com';
        db_credentials.database = 'aa';
        db_credentials.password = process.env.AWSRDS_PW;
        db_credentials.port = 5432;

        //credentials for sensor data
        var db_credentials_1 = new Object();
        db_credentials_1.user = 'jcoutwater';
        db_credentials_1.host = 'database-cook.chulj8yx5mea.us-east-1.rds.amazonaws.com';
        db_credentials_1.database = 'cook';
        db_credentials_1.password = process.env.AWSRDS_PW;
        db_credentials_1.port = 5432;

    //establishing structure for web app  
    app.get('/', function(req, res) {
       res.send(`<h1>Data Structures</h1>
       <ul>
       <li> <a href="/aadata">aa data</a> </li>
       <li> <a href="/sensordata">sensor data</a> </li>
       <li> <a href="/process">process blog</a> </li>
       </ul>`);
    });

    // Connect to the AWS RDS Postgres database
    const client1 = new Client(db_credentials);
    client1.connect();

    //holds queried AA data
    var aaQuery = [];

    //sending aaQuery to /aadata
    app.get('/aadata', function(req, res) {
        res.send(aaQuery);
    });



    // SQL statement to query street address for meetings:
    // var aaQuery_1 = "SELECT* FROM aaMeetings;";
    var aaQuery_1 = "SELECT DISTINCT street_address FROM aaMeetings;";

    client1.query(aaQuery_1, (err, res) => {
        if (err) {throw err}
        else {
            //pushing aa meetings sql query to aaQuery
            aaQuery.push(res.rows);
            console.log(aaQuery);
            client1.end();
        }
    });

    //defining new client and connecting with second set of sql credentials
    const client2 = new Client(db_credentials_1);
    client2.connect();

    //holds queried sensor data
    var sensorQuery = [];

    //sending sensorQuery to /sensordata
    app.get('/sensordata', function(req, res) {
        res.send(sensorQuery);
    });



    //SQL statement to query frequencies of various temperature values: 
    var sensorQuery_1 = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;";
    // var sensorQuery_1 = "SELECT COUNT (*) FROM sensorData;";

    client2.query(sensorQuery_1, (err, res) => {
        if (err) {throw err}
        else {
            //pushing queried sensor data to sensorQuery
            sensorQuery.push(res.rows);
            console.log(sensorQuery);
            client2.end();
        }
    });

    //link for process blog
    app.get('/process', function(req, res) {

        var dynamodb = new AWS.DynamoDB();

    //no SQL process blog credentials / query params
    var params = {
        TableName : "processBlog_JO",
        // search by project as parition key and then date by sort key (secondary search) within a certain range
        KeyConditionExpression: "#project = :projectName and #date between :minDate and :maxDate", // the query expression can use "between" for greater than or equal to each minDate and maxDate, but not for ISOString
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#project" : "project"
            ,"#date" : "date"
        },
        ExpressionAttributeValues: { // the query values
            ":projectName": {S: "AA interactive map"}
            ,":minDate": {S: new Date("2019-08-19").toISOString()}
            ,":maxDate": {S: new Date("2019-09-17").toISOString()}
        }
    };

    //noSQL query request
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                //sending data to /process link
                res.send(data);
            });
        }
    });


    });


    app.listen(8080, function() {
        console.log('Server listening...');
    });
    
    
## Reflections

I felt like this code assignment came together pretty fluidly since we had learned how to use express in class and we had all the credentials and query syntax established from other weekly assignments. One tricky part for me was creating a new cleint and new variable for the second sql credentials that host my sensor data. I had not used two sql databases in the same code before so it took some thinking to break up the client connections correctly. Also, the noSQL portion of the assignment was slightly different syntax from the SQL, so organizing that query was a little more challenging. This is assignment is really cool because we can finally see the data we've been collecting on the web! I plan to put more time into creating more queries for each database, but I plan to use at least what is hosted on the app now. 
