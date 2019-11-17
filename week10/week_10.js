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
