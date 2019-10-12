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
The second part of this week's assignment was not as straight forward as the first part. My first step in this process was to restructure my date sort key to be some form of a number-based search (still as a string) as oppsoed to having to search by typing out an entire month (08 vs. August). So, I made some changes in my week 05 code first and established the new format in the dynamomdb table. Then I started to build my query. We were given started code that can be found here.
