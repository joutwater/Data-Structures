# Week 1 Assignment
## First steps in parsing unstructured web data

Through this assignment, students are opened up to the concept of data acquisiton, one of the first processes in creating a data visualization. In this case, our task is to create a Javascript code that extracts HTML body text from ten different AA websites, each covering a certain neighborhood in NYC. After the data is extracted, we are to write ten new .txt files that are labeled corresponding to the websites, and store them all in a new directory.  

### Step 1
We are given a starter code that correctly executes the task for a single, example website and directory. We now have to figure out how to write a function that iterates this ten times with our assigned data.

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

## Step 2
