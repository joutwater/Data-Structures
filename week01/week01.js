// npm install request
// mkdir data


var request = require('request');
var fs = require('fs');

// variable defining an array of URLs

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

// variable defining an array of directory destinations and file names that correspond to the URLs
    
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

// function isolating the request from the for loop (request executed first)
// (starting code had the request within the for loop, which did not work due to Javascripts asynchronus nature)

function isolate(i) {
request(urls[i], function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync(fns[i], body);
    }
    else {console.log("Request failed!")}
  });
}

// callback for the information gathered in the request - iterated as defined (executed second)

for (var i=0; i<10; i++) {
    isolate(i);
}


//Attempts at using async: 

// async function f() {
    // let promise = new promise (error, response, body)
//  }

// async.map(urls, request, function(error, results) {
//     console.log(results);
// });
