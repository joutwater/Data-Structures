# Week 1 Assignment
## First steps in acquiring unstructured web data

Through this assignment, students are opened up to the concept of data acquisiton, one of the first processes in creating a data visualization. In this case, our task is to create a Javascript code that extracts HTML body text from ten different NYC Alcoholics Anonymous websites, writes ten new .txt files corresponding to each website, and stores them all in a specific directory.  

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
At this point, we know that we need to create a connection between the URL and directory variables, and we need to be able to iterate that process ten times, once to create each .txt file. One idea is to wrap the sample code framework in a for loop, which would theoretically assign each url request to its corresponding directory path and .txt file name. However, due to the asynchronus nature of Javascript, the for loop runs the iterations faster than the information can be requested, and thus, the code cannot not execute our task. 

    for (var i=0; i<10; i++) {
        request(urls[i], function(error, response, body){
            if (!error && response.statusCode == 200) {
                fs.writeFileSync(fns[i], body);
            }
        else {console.log("Request failed!")}
        });
    }
    
### Step 4
One solution to this problem is isolating the request in its own function, allowing the request to complete before the for loop can start iterating. This structure overcomes the asynchronous qualities of Javascript, giving the user more control over the timing of processes.

      function isolate(i) {
        request(urls[i], function(error, response, body){
            if (!error && response.statusCode == 200) {
                fs.writeFileSync(fns[i], body);
            }
        else {console.log("Request failed!")}
        });
       }
       
       for (var i=0; i<10; i++) {
          isolate(i);
       }
       
### Success!
After applying this solution, all .txt files were correctly created in the target directory, with each referencing a specfic url's body text!
