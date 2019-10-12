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
