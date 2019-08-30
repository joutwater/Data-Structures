# Week 1 Assignment
## First steps in parsing unstructured (raw) web data

Students are opened up to the concept of data acquisiton, one of the first processes in creating a data visualization.

#Challenge
We were posed the challenge of extracting body text from 10 different HTML documents, each servicing AA meetings in a particular neighborhood of NYC

Our tools for solving the challenge was a starter code snippet:

// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

request('https://parsons.nyc/thesis-2019/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});
