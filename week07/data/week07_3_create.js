//dependencies
const dotenv = require('dotenv');
const async = require ("async"); 
const { Client } = require('pg');

dotenv.config();

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'jcoutwater';
db_credentials.host = 'database-structures-1.chulj8yx5mea.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;



//STEP 1

//Connect to the AWS RDS Postgres database
// const client = new Client(db_credentials);
// client.connect();

// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE locations;"; 

//STEP 2

// SQL statement to create a table for locations:
// var thisQuery = [];

    // thisQuery += "CREATE TABLE locations (location_ID serial primary key,\
    //                                             zone varchar(3),\
    //                                             street_address varchar(200),\
    //                                             location_name varchar(200),\
    //                                             city varchar(10),\
    //                                             state varchar(5),\
    //                                             zipcode varchar(5),\
    //                                             raw_directions varchar(200),\
    //                                             loc_details varchar(300),\
    //                                             wheelchair_access varchar(10),\
    //                                             latitude double precision,\
    //                                             longitude double precision);";

    // SQL statement to create a table for groups: 
    // thisQuery += "CREATE TABLE groups (group_ID serial primary key,\
    //                                       group_name varchar(200));";
                                          
    // SQL statement to create a table for meetings: 
    // thisQuery += "CREATE TABLE meetings (location_ID int references locations(location_ID),\
    //                                      group_ID int references groups(group_ID),\
    //                                      day varchar(100),\
    //                                      start_time time,\
    //                                      start_AMPM varchar(5),\
    //                                      end_time time,\
    //                                      end_AMPM varchar(5),\
    //                                      meeting_type varchar(10),\
    //                                      meeting_desc varchar(200));";
                                         

    // client.query(thisQuery, (err, res) => {
    //     console.log(err, res);
    //     client.end();
    // });
