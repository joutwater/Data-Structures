    //dependencies
    const dotenv = require('dotenv');
    const async = require ("async"); 
    const { Client } = require('pg');

    // AWS RDS POSTGRESQL INSTANCE
    var db_credentials = new Object();
    db_credentials.user = 'jcoutwater';
    db_credentials.host = 'database-structures-1.chulj8yx5mea.us-east-1.rds.amazonaws.com';
    db_credentials.database = 'aa';
    db_credentials.password = process.env.AWSRDS_PW;
    db_credentials.port = 5432;

    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to query the entire contents of a table: 
    var thisQuery = "SELECT * FROM aalocations;";

    client.query(thisQuery, (err, res) => {
        console.log(err, res.rows);
        client.end();
    });


    // STEP 1

    // Connect to the AWS RDS Postgres database
    // const client = new Client(db_credentials);
    // client.connect();

    // Sample SQL statement to create a table: 
    // var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
    // Sample SQL statement to delete a table: 
    // var thisQuery = "DROP TABLE aalocations;"; 

    // client.query(thisQuery, (err, res) => {
    //     console.log(err, res);
    //     client.end();
    // });


    // STEP 2

    // var addressesForDb = require ("../data/first")

    // async.eachSeries(addressesForDb, function(value, callback) {
    //     const client = new Client(db_credentials);
    //     client.connect();
    //     var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
    //     client.query(thisQuery, (err, res) => {
    //         console.log(err, res);
    //         client.end();
    //     });
    //     setTimeout(callback, 1000); 
    // });

    // STEP 3

    // const client = new Client(db_credentials);
    // client.connect();

    // // Sample SQL statement to query the entire contents of a table: 
    // var thisQuery = "SELECT * FROM aalocations;";

    // client.query(thisQuery, (err, res) => {
    //     console.log(err, res.rows);
    //     client.end();
    // });

