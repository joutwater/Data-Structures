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
        var removeName = $(elem).find('b').html()
        $(elem).find('b').remove()
        var removeDiv = $(elem).find('div').html()
        $(elem).find('div').remove()
        var removeSpan = $(elem).find('span').html()
        $(elem).find('span').remove()
        
### Step 3

Next, the goal is to clean up the remaining text to be more formatted. The variable 'address' is created to remove all falsy information (.filter(Boolean)), whitespace(.trim), and indentations(.split). 'Children' and 'text' selects the parts of the untagged address line within the 'tr' tag. After this, a new variable called formattedAddress is created to hold the addresses and allow zipcode and NY NY to be spliced into a text string.

        // defines a variable that will create more consolidated addresses, with children() used to highlight
        // the untagged address line in the HTML body text. The other tools are used to remove aspects of the text
        var address = $(elem).children().text().split(/\n|,|\(|\)/).map(item => item.trim()).filter(Boolean);
        // creating a variable with empty text string to be filled with the formatted addresses
        var formattedAddress = ''

### Step 4

