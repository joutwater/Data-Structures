# Week 3 Assignment
## Assigning coordinates to addresses using geocode API

In this week's assignment, students are tasked to request coordintes from Texas AM geocode API and pair them with their repsective addresses. The input .txt is from last weeks assignment of neatly organizing addresses derived from the AA html.

### Step 1

My output addresses from last week contained an 'underfined' in the first line, so I had to remove that from the text file before using it in this week's assignment. I removed it by stating 'if' it is a 'formattedAddress', write it to the file. This will remove undefined values since only defined, formattedAddress values will be written.

     if (formattedAddress)
    // Writing parsed text to a new file with a line break after each address    
    fs.writeFile('../data/addresses1.txt', formattedAddress + '\n', {'flag':'a'}, function(err){
     if (err) {
         return console.error(err);
     }
     });

### Step 2

Below is the framework of the starter code with slight edits and extra comments added to the code. The first change I made (SEE //ONE) was altering the .txt import to be organized as an array in var addresses instead of copying and pasting each line of the text into an array manually [].

     // dependencies
     var request = require('request'); // npm install request
     var async = require('async'); // npm install async
     var fs = require('fs');
     const dotenv = require('dotenv'); // npm install dotenv

     // TAMU api key
     dotenv.config();
     const apiKey = process.env.TAMU_KEY;

     //ONE --- creating a format from the .txt that can be organized as an array in var addresses
     //instead of copying and pasting each address in []

     var content = fs.readFileSync('../data/addresses1.txt').toString().split('\n');
     //ONE --- geocode addresses
     var meetingsData = [];
     var addresses = content;

     //TWO --- eachSeries in the async module iterates over an array and operates on each item in the array in series
     async.eachSeries(addresses, function(value, callback) {
         var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
         // slicing the value to only include the start of the address up to the first comma ','
         apiRequest += 'streetAddress=' + value.slice(0,value.indexOf(",")).split(' ').join('%20');
         // added the zipcode value since I had already included it!
         apiRequest += 'zip=' + value.slice(-5);
         apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
         apiRequest += '&format=json&version=4.01';
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            // TWO --- creating the raw output from the api and
            // printing the isolated information of latitude and longitude
            // (after viewing the entire tamuGeo output and choosing which attributes I needed)
            console.log(tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude, tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude);
            // pushing entire tamuGeo to the meetings data (empty array) as defined previously
            meetingsData.push(tamuGeo);
        }
    });
    setTimeout(function(){ 
        // TWO --- setting the 2 second delay between each request until # of 'meetingsData' entries equals that of 'addresses'.
        // if they do not equal eachother, keeping calling back for the next request,
        // once they equal eachother, the next process of the code (wrtieCoords) will begin
        // (extracting the information needed from the stored requests)
        if(meetingsData.length === addresses.length) writeCoords();
        else callback ()
    }, 2000);
