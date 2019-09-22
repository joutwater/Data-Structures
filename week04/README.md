# Week 4 Assignment
## Creating an AWS database and adding addresses

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

