// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');


// load the m08.txt text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('../data/m08.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// select the target body text within the multiple table rows
$('table table table tr').each(function(i, elem) {
    
    //using if statement to go into the array and select HTML tags for removal
    if (i != 0){
        
        // these arguments remove the tags we don't need
        var removeName = $(elem).find('b').html()
        $(elem).find('b').remove()
        var removeDiv = $(elem).find('div').html()
        $(elem).find('div').remove()
        var removeSpan = $(elem).find('span').html()
        $(elem).find('span').remove()
        
        // defines a variable that will create more consolidated addresses, with children() used to highlight
        // the untagged address line in the HTML body text. The other tools are used to edit the text
        var address = $(elem).children().text().split(/\n|,|\(|\)/).map(item => item.trim()).filter(Boolean);
        // creating a variable with empty text string to be filled with the formatted addresses
        var formattedAddress = ''
        
        // iterated function to find each address by its index by line and
        // adding it to a defined (blank as of now) text string
        address.forEach(function(item, index){
            if (index === 1) formattedAddress += item
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
 
     }
 // Writing parsed text to a new file with a line break after each address    
 fs.writeFile('../data/addresses.txt', formattedAddress + '\n', {'flag':'a'}, function(err){
     if (err) {
         return console.error(err);
     }
  });
});
