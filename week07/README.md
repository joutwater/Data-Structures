# Week 7 Assignment
## Parsing and Geocoding All Zones for Input to PostgreSQL

Before starting to play with code in this assignment, I spent a lot of time thinking about the database structure and how I want the map to be organized. It was difficult to imagine how everything would come together, especially after spending so much thought and effort on correctly organizing the noSQL database. After awhile, I began to make the distinction and plan for my AA data. I knew I wanted to create a relational database so I began to break up the data in groups like location, group, and meeting times. I followed this with some research on Primary keys and Foreign keys and decided to have a the location id and group id be primary keys in a table holding the meeting info / times. Below is the structure I created:


![alt text](https://github.com/joutwater/Data-Structures/blob/master/week07/data/week07_schema.png)


### Part One: Parse

Once I had an idea of how I wanted to organize my database, I was able to start making decisions about parsing my data in code. But, of course, even though I had a picture of how I wanted it to look, figuring out how to parse it that way took some time! I was stuck on my original code (parsing solely addresses) for awhile until I realized I basically had to drop it and restructure with multiple objects, arrays, and a comprehensive json output. This took making objects for each future "table", looping through each table row within each zone file and pushing specific data to those objects. Within the meeting data, there was even a loop within the main loop to collect each meeting event as an object and place it in a nested array! ah! Please see code below: I will explain what I was able to clean and not fully clean after the code snippet...

    // dependencies fs and cheerio

    // npm install cheerio

    var fs = require('fs');
    var cheerio = require('cheerio');

    // create any empty array that holds the objects for location, group, and meeting information coming from each zone

    var allData = [];

    //loading each zones raw html text into the content variable

    var path = '../data/Raw_Text/';

    var fileName = [
        'm01',
        'm02',
        'm03',
        'm04',
        'm05',
        'm06',
        'm07',
        'm08',
        'm09',
        'm10'
        ];

    // asynchronous counter
    var fileCounter = 0 

    // Do this for each of the ten files
    fileName.forEach(file => {

        //for each zone
      var fileData = [];
        var content = fs.readFileSync('../data/Raw_Text/' + file + '.txt');


        // load `content` into a cheerio object
        var $ = cheerio.load(content);

        //find the content of concern which is nested in each tr of the third table tag. Used this in week02
        $('table table table tr').each(function(i, elem) {

            // if the style tag has this exact style, we will look at the other elements in that tr
            if ($(elem).attr('style') == 'margin-bottom:10px') {

                //local variable to hold location data objects that will be passed to the array eventually 
                var locationData = {};

                //variable defining the first td in order to begin extracting address information
                var td1 = $(elem).find('td').eq(0);

                //mark the zone in location data
                var zone = file.match(/\d+/);
                locationData.zone = zone[0];
                locationData.streetAddress = $(td1).html().split('<br>')[2].trim().split(',')[0];
                locationData.locationName = $(td1).find('h4').text().trim();
                locationData.city = 'New York';
                locationData.state = 'NY';
                locationData.zipCode = $(td1).html().split('<br>')[3].trim().substr(- 5);
                locationData.rawDirections = $(td1).html().split('<br>')[2].trim().split(',')[0] + ' ' + $(td1).html().split('<br>')[3].trim().replace(/&amp;/g,"and");
                locationData.locDetails = $(td1).find('div').text().trim();
                locationData.wheelChairAccess = $(elem).find('span').text().trim() + 'true';

                //get group data, which will just be the name of the group
                var groupData = {};

                groupData.groupName = $(td1).find('b').text().trim().split('-')[0];

                var meetingData = [];

                var td2 = $(elem).find('td').eq(1);
                var rawMeeting = td2.text().split("\n").map(line=>line.replace(/\s\s+/g," ").trim()).filter(line=>line.length);
                //line => line - take every single line and remove whitespace at the beginning and end.
                //also filtering out empty strings with filter
                //used to select items by index of words in each meeting event
                //place each event into an object and then push to array
                rawMeeting.forEach(function(event){
                    var eventArray = event.split(" ");
                    var event = {};
                    event.day = eventArray[0].slice(0,-1);
                    event.startTime = eventArray[2];
                    event.startAMPM = eventArray[3];
                    event.endTime = eventArray[5];
                    event.endAMPM = eventArray[6];
                    event.meetingType = eventArray[9];
                    event.meetingTypeLong = eventArray[11] + ' ' + eventArray[12] + ' ' + eventArray[13];
                    // event.meetingDetails = $(td1).find('div').text().trim();


                    meetingData.push(event);
                });

                //pushing data of the table row to the file(zone) data
                var rowData = {locationData, groupData, meetingData};
                fileData.push(rowData);

            };
        }); //end of row loop


        //pushing file to all data
      allData.push(fileData);

        //check if that was the last file 
        fileCounter++;
        if (fileCounter === fileName.length){
             fs.writeFileSync('../data/json/parseAll.json', JSON.stringify(allData, null, 2));
        }
    }); //end of file loop
    
    
### Part One Reflections:

It felt great to see a loop within a loop in action. The outer loop was going through each zone file, the next loop was going through each table row in the zone file, and the final loop was going through each meeting event in each table row. I don't think that this was completely necessary but it helped me understand the timing of everything by creating a parsing hierarchy of sorts. You can also see that I had a file counter so that it would know when it was finished and could start writing the json. This level of looping caused me issues later on when trying to access a certain of subset in my location data. I was getting errors because of the extra array of each zone. I eventually went in a removed the array manually because I couldn't quite figure out how to get to what I needed in the JSON.

In terms of the data cleanliness at this point, it isn't perfect but I feel that it is reasonably accurate given my abilties as a new coder. There were some inconsistencies in location data that I went through and corrected in find/replace, but I know there are probably some errors still in the JSON. Moving forward!

### Part Two : Geocoding

The next step in the process was to create coordinates from each street address, city, state, and zip that was parsed from the previous step. We had some starter code that helped organize our dependencies and the correct way to send requests to the API, but now the challenge was to pass the address information (nested in the JSON) to criteria that is used to create the coordinates. This was a matter of creating a system of dot notation to access the properties within the objects. Then, the next challenge was to nest the coordinates back in the location data object. Neil helped me figure this out and showed me how to use the dot notation again and create a placeholder in the location data that was to store the coordinates. I'm glad that I didn't run out of requests for this because I had to run the full list of addresses twice in order to see the structure that I wanted. Please see code below:


        // dependencies
        var request = require('request'); // npm install request
        var async = require('async'); // npm install async
        var fs = require('fs');
        const dotenv = require('dotenv'); // npm install dotenv

        // TAMU api key
        dotenv.config();
        const apiKey = process.env.TAMU_KEY;

        // loading and parsing the json
        var content = fs.readFileSync('../data/json/parseAll.json');
        content = JSON.parse(content);

        // empty array for group of objects
        var geocodeData = [];

        // eachSeries in the async module iterates over an array and operates on each item in the array in series
        async.eachSeries(content, function(value, callback) {

            var address = value.locationData.streetAddress;

            var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';

            // splitting address at each space and rejoining with %20 which is format for api
            apiRequest += 'streetAddress=' + address.split(' ').join('%20');

            var zipCode = value.locationData.zipCode;

            apiRequest += '&zip=' + zipCode;

            apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;

            apiRequest += '&format=json&version=4.01';

            // send api requests and checking for errors, if not continue to parse and create the coordinates in an object
            request(apiRequest, function(err, resp, body) {
                if (err) {throw err;}
                else {
                    var tamuGeo = JSON.parse(body);

                    // console.log(tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude, tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude);

                    var coordinates = {};

                    // coordinates.address = tamuGeo['InputAddress'];

                    coordinates.latitude = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'];

                    coordinates.longitude = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude'];

                    // put coordinates object in value inside location data under the name 'geoCode'
                    value.locationData["geoCode"] = coordinates;

                    // push to empty array
                    geocodeData.push(value);

                }

            });

            // wait before callback for another api request
            setTimeout(callback, 2000);

            }, function() { 
                fs.writeFileSync('../data/json/geoCoded.json', JSON.stringify(geocodeData, null, 2));
                console.log('*** *** *** *** ***');
                console.log('Number of meetings: ');
                console.log(geocodeData.length);

          });

### Part Two Reflections:

My first attempts using dot notation to access the address information was giving me errors. This was from the previously mentioned issue of an extra array surrounding the zones which I couldn't figure out how to get through with the dot notation. I had to remove those array brackets manually from each zone, but then it worked! Another issue was that I somehow accidentally removed an & for the zipcode search syntax and I kept receiving the same coordinates for each address. That took awhile to figure out because it was part of the starter code and I was looking everywhere else for the error.

### Part Three : Deleting old table and creation of three tables in SQL

The first step in this process was to drop (delete) the existing aalocations table so I had a clean slate when creating and populating my three tables (hopefully correctly!). I then created the three tables that would be holding my location, group, and meeting data. I had to do some thinking around naming each column and organizing the primary keys and foreign keys.


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
    // var thisQuery = "DROP TABLE aalocations;"; 
    
     // client.query(thisQuery, (err, res) => {
        //     console.log(err, res);
        //     client.end();
        // });

    //STEP 2

    // Sample SQL statement to create a table for locations:
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

        // Sample SQL statement to create a table for groups: 
        // thisQuery += "CREATE TABLE groups (group_ID serial primary key,\
        //                                       group_name varchar(200));";

        // Sample SQL statement to create a table for meetings: 
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
        
        
### Part Three Reflections:

The syntax was challenging for some of these table columns, especially those with different value types. I found myself getting errors for small things like commas and not closing parenthesis, but there are no notifications of those errors like there would be in regular javascript code. The hardest syntax to figure out was that of the primary key, and then connecting that value to the foreign key in another table. I had some help from classmates to work that out.

### Part Four : Populating SQL tables

---------------------
## BREAK

Unfortunately, at this point in the process, I was not able to figure out how to create the relational database and primary key / foregin key pairs how I wanted. I spent a lot of time trying to figure it out, and even though there was a classmate that had done this and graciously shared their code with me, I did not understand it well enough to confidently use it and be able to describe the process. Therefore, I decided to create one table that includes all of the data I have been parsing and geocoding. If I am able to grasp the concept and code of the relational system in SQL, I will hopefully be able to create my initial plans. 

### Part Five (A) : Clearing and creating new table

I went back and dropped the location, group, and meeting tables and then added the an aaMeetings table that will hold all of my categories and values.


Drop table:

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

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to delete a table: 
    var thisQuery = "DROP TABLE locations;";
    // also groups and meetings...

        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        
Create table:

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to create a table for aaMeetings:
    var thisQuery = [];

        thisQuery += "CREATE TABLE aaMeetings (     location_name varchar(200),\
                                                    zone varchar(3),\
                                                    street_address varchar(200),\
                                                    city varchar(10),\
                                                    state varchar(5),\
                                                    zipcode varchar(5),\
                                                    raw_directions varchar(200),\
                                                    loc_details varchar(300),\
                                                    wheelchair_access varchar(10),\
                                                    latitude double precision,\
                                                    longitude double precision,\
                                                    group_name varchar(200),\
                                                    meeting_day varchar(100),\
                                                    meeting_start time,\
                                                    start_AMPM varchar(5),\
                                                    meeting_end time,\
                                                    end_AMPM varchar(5),\
                                                    meeting_type varchar(10),\
                                                    meeting_desc varchar(200));";


        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });


### Part Five (B) : Populating table

After the table was successfully created, I made a code to insert all of the data from the JSON file into its respetive category name in a new table. It is a long list but it has everything! I used the starter code from week04 to recall some of the sytax around this process. Additionally, because there is a meetings array holding the multiple events and times, a loop within a loop was created to extract data for each meeting and keep it associated with its respective location and group data.


    var aaMeetingsForDb = fs.readFileSync("../data/json/geoCoded.json");

    aaMeetingsForDb = JSON.parse(aaMeetingsForDb);

    //creating a way to access each meeting event within the array, in each instance of an "table row" object
    async.eachSeries(aaMeetingsForDb, function(value, callback1) {
        //value is object with locationData, groupData, and the meetingData array

        async.eachSeries(value.meetingData, function(meeting, callback2) {
            //meeting is object with day, startTime, etc.
            //inner loop still has access to value and its location/group data

              //connect to db
              const client = new Client(db_credentials);
              client.connect();

              var thisQuery = "INSERT INTO aaMeetings VALUES ('" + value.locationData.locationName + "',\
                                                              '" + value.locationData.zone + "',\
                                                              '" + value.locationData.streetAddress + "',\
                                                              '" + value.locationData.city + "',\
                                                              '" + value.locationData.state + "',\
                                                              '" + value.locationData.zipCode + "',\
                                                              '" + value.locationData.rawDirections + "',\
                                                              '" + value.locationData.locDetails + "',\
                                                              '" + value.locationData.wheelChairAccess + "',\
                                                              '" + value.locationData.geoCode.latitude + "',\
                                                              '" + value.locationData.geoCode.longitude + "',\
                                                              '" + value.groupData.groupName +"',\
                                                              '" + meeting.day + "',\
                                                              '" + meeting.startTime + "',\
                                                              '" + meeting.startAMPM + "',\
                                                              '" + meeting.endTime + "',\
                                                              '" + meeting.endAMPM + "',\
                                                              '" + meeting.meetingType + "',\
                                                              '" + meeting.meetingTypeLong + "');";
              client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });

         //end inner loop
         setTimeout(callback2, 1000);
      });

        //end outer loop
        setTimeout(callback1, 1000);
    });

        
### Part Five (C) : Querying from the table

When the data was successfully populated in the aameetings table, a query was created to check the data! I searched for each group name in the table. In this process and another looking at location queries, I could see that were repetitive names and other redudant information, but the table should still function properly! The query ran very quickly. See a screenshot of the query below the code.


    const client = new Client(db_credentials);
    client.connect();

    // Sample SQL statement to query the groups names from the table: 
    var thisQuery = "SELECT group_name FROM aaMeetings;";

    client.query(thisQuery, (err, res) => {
        console.log(err, res.rows);
        client.end();
    });
    
![alt text](https://github.com/joutwater/Data-Structures/blob/master/week07/data/week07_query_evidence.png)   
