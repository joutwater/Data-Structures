# Week 4 Assignment
## Creating an AWS database and adding addresses

### Part One: Plan
Before documenting the coding assignment for the week, I will answer the few questions for PART ONE of the assignment. Amanda and I worked together in class to create a sketch that we think would best represent a good database for the AA project. It is important to logically categorize and nest data within realted categories, especially when presented with the challenge of organizing the AA data. The "where, when, and what" are used to intuitively set up the database structure, as those three categories represent the baseline information needed about a meeting. 

### Assignment

Once again, this assignment builds on the previous week's assignment. Last week's goal was to create a .json file continaing an array of objects including input addresses and associated lat/long coordinates. This week, students will create an AWS database and add the .json file to the newly created database by creating a table in the database and then adding the information to the table.

I would also like to mention that this process takes three cycles of different code to be accomplished. There are common aspects between the codes but other aspects are replaced with new code in each cycle, targeting either table creation, .json input to table, and querying the database. My .js file for the assignment will show the querying cycle as active, with the table creation and address input code commented out.

### Step 1

After creating the database and matching personal credentials to appropriate items in the starter code, the code is run to create a table in the database. However, I had an error logging in with my database credentials and, therefore, couldn't create the table. I realized that I had not set up the dotenv dependency, so I copy and pasted that code from last week's assignment. I then ran the code and it worked! The table was created in the database. I was able to confirm its creation by seeing the console.log which showed null values for the table.

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


    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to create a table: 
    var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
    // Sample SQL statement to delete a table: 
    // var thisQuery = "DROP TABLE aalocations;"; 

    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    
### Step 2

Now that the table 'aalocations' is created, the .json file can be loaded to it. The code is similar to the previous cycle until after the db.credentials are deinfed. 'var addressesForDb' is created and this is where I will include the 'first.json' file from last week as the data used to populate the table. The async.eachSeries adds the values for each address and related coordinates to the table.  

    var addressesForDb = require ("../data/first")

    async.eachSeries(addressesForDb, function(value, callback) {
        const client = new Client(db_credentials);
        client.connect();
        var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " +        value.latLong.lng + ");";
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        setTimeout(callback, 1000); 
    });
    
### Step 3

The final step is to query the database in order to check that the data in the newly populated table exists as desired. The query and console.log returned my addresses and coordinate information!  

    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to query the entire contents of a table: 
    var thisQuery = "SELECT * FROM aalocations;";

    client.query(thisQuery, (err, res) => {
        console.log(err, res.rows);
        client.end();
    });
    
    
![alt text](https://github.com/joutwater/Data-Structures/master/week04/week04a_results.png)
