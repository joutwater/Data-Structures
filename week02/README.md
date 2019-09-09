# Week 2 Assignment
## Scraping text from HTML body to find list of addresses

As a follow up from last week's assignment, students are given the opportunity to extract specific data from large, unorganized HTML body text. The students are challeneged to isolate the information requested and organize in a neat, line-by-line text file of addresses. Scraping, parsing, and string edtiting tools are explored in this assignment.

### Step 1

We are given a starter code that extracts text from an example file and write to a new file. This is the first time we have been exposed to cheerio.

    // npm install cheerio

    var fs = require('fs');
    var cheerio = require('cheerio');

    // load the thesis text file into a variable, `content`
    // this is the file that we created in the starter code from last week
    var content = fs.readFileSync('data/thesis.txt');

    // load `content` into a cheerio object
    var $ = cheerio.load(content);

    // print (to the console) names of thesis students
    $('h3').each(function(i, elem) {
    console.log($(elem).text());
    });

    // write the project titles to a text file
    var thesisTitles = ''; // this variable will hold the lines of text

    $('.project .title').each(function(i, elem) {
    thesisTitles += ($(elem).text()).trim() + '\n';
    });

    fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
    
### Step 2

Start to replace the example data with the assignments data and find differences bewteen the two. At this point, we see that the html in our assignment is much less organized and will take specific tools to gather the addresses. One of the first issues is that the addresses are not within certain html tags, so the closest tag that can be targeted is the table row tag within three table tags (table, table, table, tr). Once that is found, we go into each tr tag and remove excess information like 'b', 'div', and 'span' tags. Now we have narrowed the window of our data to a more manageable size.

    var $ = cheerio.load(content);

    // select the target body text within the multiple table rows
    $('table table table tr').each(function(i, elem) {
    
    //using if statement to go into the array and select HTML tags for removal
    if (i != 0){
        
        // these functions remove the tags we don't need
        
        var removeName = $(elem).find('h4').html()
        $(elem).find('h4').remove()
        
        var removeName = $(elem).find('b').html()
        $(elem).find('b').remove()
        
        var removeDiv = $(elem).find('div').html()
        $(elem).find('div').remove()
        
        var removeSpan = $(elem).find('span').html()
        $(elem).find('span').remove()
        
### Step 3

Next, the goal is to clean up the remaining text to be more formatted. The variable 'address' is created to remove all falsy information (.filter(Boolean)), whitespace(.trim), and indentations(.split). 'Children' and 'text' selects the parts of the untagged address line within the 'tr' tag. After this, a new variable called formattedAddress is created to hold the addresses and allow zipcode and NY NY to be spliced into a text string.

        var address = $(elem).children().text().split(/\n|,|\(|\)/).map(item => item.trim()).filter(Boolean);
        
        var formattedAddress = ''

### Step 4

Each group of addresses and associated information is broken up into a number of indices, and within each grouping index is an index for each line. The line index position for the address in each group is 1. Therefore, we are asking to find the index 1 item within each address group and add that to the formattedAddresses text string. Then, if the line index is not 1, look for five digits (zipcode), and when that is found, add that to a locations holder that also contains a text string of 'New York, NY'. This will all be added to the formattedAddresses variable that already contains the first part of the address.

    address.forEach(function(item, index){
                if (index === 0) formattedAddress += item
                else {
                
                    //process testing for five digits, finding the zipcode, and adding to a new variable
                    //add to formatted address with "new york, ny" in between
                    const regex = /\d{5}/g
                    const position = item.search(regex)
                    
                    // if position is found (not -1 (undefined))
                        if (position !== -1){
                            const zipCode = item.slice(position, position + 5)
                            const locations = ', New York, NY ' + zipCode
                
                        formattedAddress += locations
                }
            }
            
        });

### Step 5

Once the list was compiled after multiple console.log checks and slight edits, the text was written to a new file called addresses. I used fs.writeFile instead of .writeFileSync because .writeFile's callback function creates delays that allow the preceeding code to be processed before writing the file.

     fs.writeFile('../data/addresses.txt', formattedAddress + '\n', {'flag':'a'}, function(err){
         if (err) {
             return console.error(err);
         }
     
### Errors

My final .txt file had a couple issues. There were a few instances where a NY NY and zipcode was added to items that I was not targeting through index===1, so somehow they are included in that index? Also the first line is undefined and I am not quite sure why. I will have to spend more time researching these issues, but this was the best I could do up until this point. Always learning!  


