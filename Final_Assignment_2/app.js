var express = require('express'), // npm install express
    app = express();
var dotenv = require('dotenv');
    dotenv.config();
    const { Client } = require('pg');
    var fs = require('fs');
    const async = require ("async"); 
    const { Pool } = require('pg');
    const moment = require('moment-timezone');
    const handlebars = require('handlebars');
    
var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";
    
    var dynamodb = new AWS.DynamoDB();

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

//handlebars for tempsensor    
const indexSource = fs.readFileSync("templates/sensor.html").toString();
var template = handlebars.compile(indexSource, { strict: true });
    
// create templates for AA map
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link rel="stylesheet" href="styles.css?v=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
</head>
<body>
<div id="mapid"></div>
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
  integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
  crossorigin=""></script>
  <script>
  var data = 
  `;
  


var jx = `;
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
    }).addTo(mymap);
    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].latitude, data[i].longitude] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
    </script>
    </body>
    </html>`;
    
//establishing structure for web app  
app.get('/', function(req, res) {
  res.send(`<h1>Data Structures</h1>
  <ul>
  <li> <a href="/aadata">aa data</a> </li>
  <li> <a href="/sensordata">sensor data</a> </li>
  <li> <a href="./blog.html">process blog</a> </li>
  </ul>`);
});

//getting aadata
app.get('/aadata', function(req, res) {

//variables to be used in the AA sql query
//querying by meetings by current day with start times between current time and two hours from current time
var now = moment.tz(Date.now(), "America/New_York");
var dayNumber = now.day().toString();
var dayString = now.day(dayNumber).format("dddd");
var dayStringPlus = now.day(dayNumber).add(1).format("dddd");
if (dayNumber = 6){
    dayStringPlus = 'Sunday' 
};

var hourNumber = now.hour().toString();
//var hourNumber = 23
var hourFormatted = now.hour(hourNumber).format("hh:mm:ss A");
var nowTime = hourFormatted.slice(0,-3);
var nowAMPM = hourFormatted.slice(-2);

var twoHourFormatted = now.hour(hourNumber).add(2,"h").format("hh:mm:ss A");
var twoNowTime = twoHourFormatted.slice(0,-3);
var twoNowAMPM = twoHourFormatted.slice(-2);


// Connect to the AWS RDS Postgres database
const client1 = new Pool (db_credentials);

// var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
//                  FROM aaMeetings
//                  WHERE meeting_day = '` + dayString +
//                  `' GROUP BY latitude, longitude;`;
                 
// FINAL query: This query solves the issue of finding time two hours from now when the time is between 10 and 12 and 22 and 24.
// The parsed data is in the 12 hour clock system so I had to tell it to query meetings under certain conditions.
if (hourNumber >= 10 && hourNumber <= 12){var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
                 FROM aaMeetings
                 WHERE (meeting_day = '` + dayString + "' and meeting_start > '" + nowTime + "' and start_AMPM = '" + nowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start < '" + '11:59:00' + "' and start_AMPM = '" + nowAMPM +`')
                 OR (meeting_day = '` + dayString + "' and meeting_start >= '" + '00:00:00' + "' and start_AMPM = '" + twoNowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start <= '" + twoNowTime + "' and start_AMPM = '" + twoNowAMPM +`')
                 GROUP BY latitude, longitude;`;
                 
} else if (hourNumber >= 22 && hourNumber <= 24){var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
                 FROM aaMeetings
                 WHERE (meeting_day = '` + dayString + "' and meeting_start > '" + nowTime + "' and start_AMPM = '" + nowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start < '" + '23:59:59' + "' and start_AMPM = '" + nowAMPM +`')
                 OR (meeting_day = '` + dayStringPlus + "' and meeting_start >= '" + '00:00:00' + "' and start_AMPM = '" + twoNowAMPM +`')
                 AND (meeting_day = '` + dayStringPlus + "' and meeting_start <= '" + twoNowTime + "' and start_AMPM = '" + twoNowAMPM +`')
                 GROUP BY latitude, longitude;`;
    
} else {var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
                 FROM aaMeetings
                 WHERE (meeting_day = '` + dayString + "' and meeting_start > '" + nowTime + "' and start_AMPM = '" + nowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start < '" + twoNowTime + "' and start_AMPM = '" + twoNowAMPM +`')
                 GROUP BY latitude, longitude;`;
    
}


        console.log(twoNowTime)         
         console.log(aaQuery_1);
                 
client1.query(aaQuery_1, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        // adding response to template
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            // console.log(resp)
            console.log('AA) responded to request for aa meeting data');
            
        }
    });

});
      //getting sensor data
      app.get('/sensordata', function(req, res) {


      //defining new client and connecting with second set of sql credentials
      const client1 = new Pool (db_credentials_1);

      //SQL statement to query average temperature values every hour for a month
      var sensorQuery_1 = `WITH times as (
                                SELECT sensorYear::int,
                                  sensorMonth::int,
                                  sensorDay::int,
                                  EXTRACT (HOUR from sensorTime)::int as sensorHour,
                                  sensorValue
                                FROM sensorData
                                )
      
                                SELECT sensorYear,
                                  sensorMonth,
                                  sensorDay,
                                  sensorHour,
                                  AVG(sensorValue::int) as tempvalue
                                  FROM times
                                  GROUP BY sensorYear, sensorMonth, sensorDay, sensorHour
                                  ORDER BY sensorYear, sensorMonth, sensorDay, sensorHour;`;
      client1.connect();
      client1.query(sensorQuery_1, (qerr, qres) => {
          if (qerr) {throw qerr}
          else {
              //combining queried sensor data with template
              res.end(template({sensorData: JSON.stringify(qres.rows)}));
              client1.end();
            //   console.log(qres.rows);
          }
      });
    });
    
        //getting processblog data
        app.get('/process', async function (req, res) {
            console.log('AJAX just called the process endpoint')
            //controlling asynchronicity with await
            if (req.query == {}){
                 res.send(await processBlog());
            } else {
                 res.send(await processBlog(req.query.category));
            }
        });

        // Create a function to query data by dates and project 
        function processBlog(project){
            return new Promise(resolve => {
            var output = {};
        
            var minDate = "August 10 2019"
            var maxDate = "December 20 2020"; 
            project = project || 'all';
            
            //empty array to hold blogposts for output
            output.blogpost = [];
            
            //If not all projects are selected, start a scan
            if (project != 'all'){
            var params = {
                TableName : "processBlog_JO",
                KeyConditionExpression: "#p = :projectName and #d between :minDate and :maxDate", // the query expression
                ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
                "#p" : "project"
                ,"#d" : "date"
                },
                ExpressionAttributeValues: { // the query values
                    ":projectName": {S: project},
                    ":minDate": {S: new Date(minDate).toISOString()},
                    ":maxDate": {S: new Date(maxDate).toISOString()},
                }
            };
            
            dynamodb.query(params, onScan)
            
            //else, use a query because it will be faster
            } else {
            var params = {
                TableName: "processBlog_JO",
                ProjectionExpression: "#p, #d, content, skills",
                FilterExpression: "#d between :minDate and :maxDate",
                ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
                "#p" : "project"
                ,"#d" : "date"
                },
                 ExpressionAttributeValues: { // the query values
                    ":minDate": {S: new Date(minDate).toISOString()},
                    ":maxDate": {S: new Date(maxDate).toISOString()}
                }
            };
            
            
            dynamodb.scan(params, onScan)

        }
        
        // console.log(params);

        //process to format and organize the scan/query
        function onScan(err, data) {
            if (err) {
                console.error("Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                data.Items.forEach(function(item) {
                    output.blogpost.push({'project':item.project.S, 'date':item.date.S, 'content':item.content.S, 'skills':item.skills.S});
                });
                // console.log(data);
                //reading the template file for input of the queried data
                fs.readFile('processblog.html', 'utf8', (error, data) => {
                    // console.log(data1);
                    var template = handlebars.compile(data);
                    var html = template(output);
                    resolve(html);
                });
            }
        };
    });
 }

      app.use(express.static('public'));
      
      app.listen(8080, function() {
          console.log('Server listening...');
      });
