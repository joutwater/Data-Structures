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
