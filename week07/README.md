# Week 7 Assignment
## Parsing and Geocoding All Zones for Input to PostgreSQL

Before starting to play with code in this assignment, I spent a lot of time thinking about the database structure and how I want the map to be organized. It was difficult to imagine how everything would come together, especially after spending so much thought and effort on correctly organizing the noSQL database. After awhile, I began to make the distinction and plan for my AA data. I knew I wanted to create a relational database so I began to break up the data in groups like location, group, and meeting times. I followed this with some research on Primary keys and Foreign keys and decided to have a the location id and group id be primary keys in a table holding the meeting info / times. Below is the structure I created:


![alt text](https://github.com/joutwater/Data-Structures/blob/master/week07/data/week07_schema.png)


### Part One: Parse

Once I had an idea of how I wanted to organize my database, I was able to start making decisions about parsing my data in code. But, of course, even though I had a picture of how I wanted it to look, figuring out how to parse it that way took some time! I was stuck on my original code (for parsing solely addresses) for awhile until I realized I had basically to drop it and restructure with multiple objects, arrays, and a comprehensive json output. This took making objects for each future "table", looping through each table row within each zone file and pushing specific data to each. Within the meeting data, there was even a loop within the main loop to collect each meeting event as an object and place it in a nested array! ah! Please see code below: I will explain what I was able to clean and not fully clean after the code snippet...

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

        //find the content of concern which is nested in the tr of the third table tag. Used this in week02
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

Looking back I actually think I had a loop, within a loop, wihtin a loop. The outer loop was going through each zone file, the next loop was going through each table row in the zone file, and the final loop was going through each meeting event in each table row. I don't think that this was completely necessary but it helped triple check that I was in control of the asynchronicity. You can also see that I had a file counter so that it would know when it was finished and could start writing the json. This level of looping caused me issues later on when trying to access a certain of subset in my location data. I was getting errors because of the extra array of each zone. I eventually went in a removed that because I couldn't quite figure out how to get to what I needed in the JSON.

In terms of the data cleanliness at this point, it isn't perfect but it I feel that it is reasonably accurate given my abilties as a new coder. There were some inconsistencies in location data that I went through and corrected in find/replace, but I know there are probably some errors still in the JSON. Moving forward!

### Part Two : Geocoding
