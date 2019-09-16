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

Below is the framework of the starter code with slight edits and extra comments added. The first change I made (SEE //ONE) was altering the .txt import to be organized as an array in var addresses instead of copying and pasting each line of the text into an array manually [' ']. The next change to the starter code (SEE //TWO) was to edit the streetAddress value by creating a slice that would only include the first character up to the first comma (ex: '106 7th Avenue') from each meeting address. According to the API documentation, that was the preferred format for streetAddress. I also added a zipcode value, because I had already created zipcodes in the previous assignment. This value was created with a slice taking the last 5 characters from each address line. 

There was not much to change in the request code, however, after viewing the output of the JSON file, I wanted to target the coordintes only and console.log them, just so I could see them on their own. I found that within tamuGeo and then within index '0' of the OutputGeocodes was another OutputGeocode that holds the latitude and longitude values. I will use the same path to the coordinate information later when isolating the coordinates into a final array.

As a final note on the request and associated setTimeout, I edited the code there to allow time for each request and signify when to start the next step, writeCoords. When the number of entries in meetingsData equals the number of addresses in my input .txt, start writeCoords. If not, wait 2000 miliseconds and make the next api request. This will allow all requests to process and avoid any complication with asynchronicity.

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
    
### Step 3

After all of the reuqests were run and added to the meetingsData array, it was time to pick and choose the information needed for the final array. First, I created a new variable called 'data' to hold the final array and used meetingsData.map to pick and choose desired attributes from meetingsData (latitude and longitude). A sequence similar to what was used in the previously described console.log was used to isolate the coordinates and add them as an object to the 'data' array along with the matching input addresses from 'var address'.  

     //THREE --- creating the final array with addresses and lat long objects - refer to the above code ^ 
     function writeCoords() {
         let data = meetingsData.map(dataConvert);

     //THREE --- (had to place into function instead of within .map because of an otherwise unresolvable error)
         // add the (var) addresses by index to the address obj in a new array,
         // for the latLong object, take the index[0] from each 'OutputGeocode' 
         // and within that, add the data from 'OutputGeocode.Latitude'
         // Do the same for lng!
     function dataConvert(obj, index){
         return {address:addresses[index],
         latLong:{lat:obj.OutputGeocodes[0].OutputGeocode.Latitude,
         lng:obj.OutputGeocodes[0].OutputGeocode.Longitude}}
         };
         
### Step 4

          //FOUR --- write file . 'data now contains the final array for output, so that is targeted'
              fs.writeFileSync('../data/first.json', JSON.stringify(data));
              console.log('*** *** *** *** ***');
              console.log('Number of meetings in this zone: ');
              console.log(meetingsData.length);
              }
