# Week 9 Assignment
## Parsing Temperature Data from URL and Timed Input to PostgreSQL

In this week's [assignment](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_09.md), students are able to put their skills to the test as we execute methods that have been experienced in AA data assignments. We have setup a temperature sensor that is constantly relaying temperature and other data to a url through an API. The url is requested in the code, the data is parsed and split into different categories, and then the information is populated in an SQL database. The first step is to create a new database and table in SQL (which we have experience with in a previous assignment). See the code below:


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

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week09/query_proof.png)


### Part One: Parse
