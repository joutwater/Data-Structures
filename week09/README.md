# Week 9 Assignment
## Parsing Temperature Data from URL and Timed Input to PostgreSQL

In this week's [assignment](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_09.md), students are able to put their skills to the test as we execute methods that have been experienced in AA data assignments. We have setup a temperature sensor that is constantly relaying temperature and other data to a url through an API. The url is requested in the code, the data is parsed and split into different categories, and then the information is populated in an SQL database. There were many steps taken before starting this assignment that helped manage our sensor and SQL database credentails.

### Part One: Create Table

The first step is to create a new database and table in SQL (which we have experience with in a previous assignment). See the code below:


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


### Part Two: Parse, categorize, and populate in SQL

After the table was created (and edited a few times for input types and ordering), I began to the parse the data from the url. The data is in JSON form, So I used dot notation, slices, and splits to target different elements of the JSON. I also used dot notation to direct different parsed information to an object called data, from which I loaded the information to the SQL database. The getAndWriteData function executes the previously described methods and is activated every five minutes using pm2 and setInterval. Please see the code below (I will remove the dependencies for this but please view the whole code in my week09 repository):


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


### Part Three: Query and Check the Data

After running mulitple checks and having to drop and recreate tables multiple times, I was able to query the data and see the results I wanted! Please see the code and screenshot of the terminal below (again, credentials are removed):


    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statements for checking your work: 
    var thisQuery = "SELECT * FROM sensorData;"; // print all values
    var secondQuery = "SELECT COUNT (*) FROM sensorData;"; // print the number of rows
    var thirdQuery = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;"; // print the number of rows for    each sensorValue

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
  
  

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week09/query_proof.png)


### Part Four: Reflections

