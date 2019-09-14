# Week 3 Assignment
## Assigning coordinates to addresses using geocode API

In this week's assignment, students are tasked to request coordintes from Texas AM geocode API and pair them with their repsective addresses. The input .txt is from last weeks assignment of neatly organizing addresses derived from the AA html.

### Step 1

My output addresses from last week contained an 'underfined' in the first line, so I had to remove that from the text file before using it in this week's assignment. I removed it by stating 'if' it is a 'formattedAddress', write it to the file. This will remove undefined values because only defined values will be written

     if (formattedAddress)
    // Writing parsed text to a new file with a line break after each address    
    fs.writeFile('../data/addresses1.txt', formattedAddress + '\n', {'flag':'a'}, function(err){
     if (err) {
         return console.error(err);
     }
     });
