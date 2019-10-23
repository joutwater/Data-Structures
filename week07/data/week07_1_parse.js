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
