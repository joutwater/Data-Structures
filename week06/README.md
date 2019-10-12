# Week 6 Assignment
## Executing queries from both a PostgreSQL and noSQL database

### Part One: AA dataset, PostgreSQL
The first part of this week's assignment is to query from an SQL database that we created through AWS RDS. It contains parsed data from the AA website that has been the basis of one of our projects. Although I plan to add more data and restructure how it is organized eventually, I wanted to test the query with what I have already populated in the database. The table contains addresses and latitude/longitude for each address. I will query the latitude and longitude for one address: "109 West 129th Street, New York, NY 10027".

See below for the code! Much of it was re-used from the code to create the database, but small changes were made to make it into a query.

    //dependencies
    const dotenv = require('dotenv');
    dotenv.config();
    const async = require ("async"); 
    const { Client } = require('pg');
    // AWS RDS POSTGRESQL INSTANCE
    var db_credentials = new Object();
    db_credentials.user = 'jcoutwater';
    db_credentials.host = 'database-structures-1.chulj8yx5mea.us-east-1.rds.amazonaws.com';
    db_credentials.database = 'aa';
    db_credentials.password = process.env.AWSRDS_PW;
    db_credentials.port = 5432;

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to query lat/long for meetings at the address 109 West 129th Street, New York, NY 10027: 
    var thisQuery = "SELECT lat, long FROM aalocations WHERE address = '109 West 129th Street, New York, NY 10027';";

    client.query(thisQuery, (err, res) => {
        if (err) {throw err}
        else {
            console.table(res.rows);
            client.end();
        }
    });
    
Result of the query:

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week06/data/week06_SQL.png)

### Part Two: Progress Blog, DynamoDB (noSQL)
The second part of this week's assignment was not as straight forward as the first part. My first step in this process was to restructure my date sort key to be some form of a number-based search (still as a string) as oppsoed to having to search by typing out an entire month (08 vs. August). So, I made some changes in my week 05 code first and established the new format in the dynamomdb table. Then I started to build my query. We were given started code that can be found [here](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_06.md)

It took me some trial and error to get the string format correct in the query. Once that seemed to work, I was getting query successful but not seeing anything else in the console log. I figured out that I had to go back to week 05 again and turn the date string into a "new Date(date).toLocaleString();" in order to actually make the string into a date (or so I thought). This enabled the query and successful console.log, but the minDate and maxDate were not querying according to the date values as whole, but the values at each character along the indices of the date string, returning an inaccurate date range. I then figured out (with a lot of help from Ryan) that I needed to make the week05 input of date as an ISOString. This makes the string a date as a whole and can accurately be queried in the date range.

See the code below and results!

    // npm install aws-sdk
    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "processBlog_JO",
        // search by project as parition key and then date by sort key (secondary search) within a certain range
        KeyConditionExpression: "#project = :projectName and #date between :minDate and :maxDate", // the query expression can         use "between" for greater than or equal to each minDate and maxDate, but not for ISOString
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

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log("***** ***** ***** ***** ***** \n", item);
            });
        }
    });

Results

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week06/data/week06_NO_SQL.png)
