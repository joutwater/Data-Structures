//dependencies
const dotenv = require('dotenv');
const async = require ("async"); 
const { Client } = require('pg');
const fs = require('fs');

dotenv.config();

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'jcoutwater';
db_credentials.host = 'database-structures-1.chulj8yx5mea.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;
 


//STEP 1

// // Connect to the AWS RDS Postgres database
// const client = new Client(db_credentials);
// client.connect();

// // Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE locations;"; 

//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });

//STEP 2

// // Connect to the AWS RDS Postgres database
// const client = new Client(db_credentials);
// client.connect();

// // Sample SQL statement to create a table for aaMeetings:
// var thisQuery = [];

//     thisQuery += "CREATE TABLE aaMeetings (     location_name varchar(200),\
//                                                 zone varchar(3),\
//                                                 street_address varchar(200),\
//                                                 city varchar(10),\
//                                                 state varchar(5),\
//                                                 zipcode varchar(5),\
//                                                 raw_directions varchar(200),\
//                                                 loc_details varchar(300),\
//                                                 wheelchair_access varchar(10),\
//                                                 latitude double precision,\
//                                                 longitude double precision,\
//                                                 group_name varchar(200),\
//                                                 meeting_day varchar(100),\
//                                                 meeting_start time,\
//                                                 start_AMPM varchar(5),\
//                                                 meeting_end time,\
//                                                 end_AMPM varchar(5),\
//                                                 meeting_type varchar(10),\
//                                                 meeting_desc varchar(200));";
                                        

//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });


// STEP 3

// var aaMeetingsForDb = fs.readFileSync("../data/json/geoCoded.json");

// aaMeetingsForDb = JSON.parse(aaMeetingsForDb);

// //creating a way to access the meeting data within the array in each instance of an object
// async.eachSeries(aaMeetingsForDb, function(value, callback1) {
//   	//value is object with locationData, groupData, and the meetingData array
  
//   	async.eachSeries(value.meetingData, function(meeting, callback2) {
//       	//meeting is object with day, startTime, etc.
//       	//inner loop still has access to value and its location/group data
  
//       	  //connect to db
//   		  const client = new Client(db_credentials);
//           client.connect();
          
//           var thisQuery = "INSERT INTO aaMeetings VALUES ('" + value.locationData.locationName + "',\
//                                                           '" + value.locationData.zone + "',\
//                                                           '" + value.locationData.streetAddress + "',\
//                                                           '" + value.locationData.city + "',\
//                                                           '" + value.locationData.state + "',\
//                                                           '" + value.locationData.zipCode + "',\
//                                                           '" + value.locationData.rawDirections + "',\
//                                                           '" + value.locationData.locDetails + "',\
//                                                           '" + value.locationData.wheelChairAccess + "',\
//                                                           '" + value.locationData.geoCode.latitude + "',\
//                                                           '" + value.locationData.geoCode.longitude + "',\
//                                                           '" + value.groupData.groupName +"',\
//                                                           '" + meeting.day + "',\
//                                                           '" + meeting.startTime + "',\
//                                                           '" + meeting.startAMPM + "',\
//                                                           '" + meeting.endTime + "',\
//                                                           '" + meeting.endAMPM + "',\
//                                                           '" + meeting.meetingType + "',\
//                                                           '" + meeting.meetingTypeLong + "');";
//           client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
    
//      //end inner loop
//      setTimeout(callback2, 1000);
//   });
      
//     //end outer loop
//     setTimeout(callback1, 1000);
// });                                               
        

// STEP 4 

// const client = new Client(db_credentials);
// client.connect();

// // Sample SQL statement to query the groups names from the table: 
// var thisQuery = "SELECT group_name FROM aaMeetings;";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res.rows);
//     client.end();
// });

