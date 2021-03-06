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

        //THREE --- creating the final array with addresses and lat long objects - refer to the above code ^ 
        function writeCoords() {
            let data = meetingsData.map(dataConvert);

            //FOUR --- write file . 'data now contains the final array for output, so that is targeted'
            fs.writeFileSync('../data/first.json', JSON.stringify(data));
            console.log('*** *** *** *** ***');
            console.log('Number of meetings in this zone: ');
            console.log(meetingsData.length);
        }

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
          }, 
        );
