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

### Step 2
Create variables for both the URLs and directory destinations, using array and text strings within those variables 

     var urls = [
     'https://parsons.nyc/aa/m01.html',  
     'https://parsons.nyc/aa/m02.html',  
     'https://parsons.nyc/aa/m03.html',  
     'https://parsons.nyc/aa/m04.html',  
     'https://parsons.nyc/aa/m05.html',  
     'https://parsons.nyc/aa/m06.html',  
     'https://parsons.nyc/aa/m07.html',  
     'https://parsons.nyc/aa/m08.html',  
     'https://parsons.nyc/aa/m09.html',  
     'https://parsons.nyc/aa/m10.html'  
     ];
    
    var fns = ['/home/ec2-user/environment/data/m01.txt',
    '/home/ec2-user/environment/data/m02.txt',
    '/home/ec2-user/environment/data/m03.txt',
    '/home/ec2-user/environment/data/m04.txt',
    '/home/ec2-user/environment/data/m05.txt',
    '/home/ec2-user/environment/data/m06.txt',
    '/home/ec2-user/environment/data/m07.txt',
    '/home/ec2-user/environment/data/m08.txt',
    '/home/ec2-user/environment/data/m09.txt',
    '/home/ec2-user/environment/data/m10.txt'
    ];
    
### Step 3
At this point, we know that we need to create a connection between the URL and directory variables, and we need to be able to iterate that process ten times, once to create each .txt file. One idea is to wrap the sample code framework in a for loop, which would theoretically assign each url request to its corresponding directory path and .txt file name. However, due to the asynchronus nature of Javascript, the for loop runs the iterations faster than the information can be requested, and thus, the code does not execute our task. 

    for (var i=0; i<10; i++) {
        request(urls[i], function(error, response, body){
            if (!error && response.statusCode == 200) {
                fs.writeFileSync(fns[i], body);
            }
        else {console.log("Request failed!")}
        });
    }
    
### Step 4
One solution to this problem is isolating the request in its own function. This allows the request to execute before the for loop can begin iterating the information from the request.
