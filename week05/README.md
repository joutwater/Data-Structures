# Week 5 Assignment
## Creating a noSQL database with Dynamo DB and adding blog entries

### Part One: Plan
The noSQL database created this week is quite different to the normalized database I skecthed for last week's assignment with the AA data. The Process Blog data structure is much less relational and has less tables. The only formal organization is the project (partition key) and the date (sort key).

1. I will use a denormalized data model for the process blog because I want fewer rules about structure and, therefore, more ease in adding new information and faster queries.

2. When the data comes out, I would want data from a certain blog post to be structured like this:<br/>
                BlogEntry {<br/>
                    ‘Project’ : 'AA interactive map'<br/>
                    ‘Date’ : 'September 16th, 2019'<br/>
                    ‘Skills’ : ‘javascript’<br/>
                    ‘Content’ : ‘text...’<br/>
                    ‘Reflections’ : ‘text…’<br/>
                }<br/>
  The data does not need to be in an elaborate table like SQL or other database outputs. As the example shows, I imagine the user only wanting relatively simple information through an easy search. To my understanding, these qualitites reflect the purpose of a noSQL database. 
  
3. The hierarchy of the data is limited to the categrories of project and date. I designed the database to group each post by project (partition key) and then, within each post, the date (sort key) can be used as a secondary search value. So, the project value is the primary category for grouping while the date value doesn't necessarily group posts but is a sub-category by which a search request can be completed. After project and date categories are defined, every other category has the same value in terms of hierarchy level.


![alt text](https://github.com/joutwater/Data-Structures/blob/master/week05/data/week05_datastructures1.png)

### Part Two:

The starter code provides a framework for creating new blog entries in an array, that is to be eventually added to a dynamo database that I created. The database was created following instructions offered by the instructor, who also included instructions on how to setup permissions allowing one's cloud 9 EC2 instance to connect with dynamo db. It is very important to establish this connection instead of using passwords or other private keys in the code that could mistakenly be uploaded to github.

The code below is adapted from the [starter code](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_05.md). I chose to use project as a partition key, date as a sort key, and use skills, content, and reflections as other categories to be added to the noSQL database.


    // asnyc dependency
    var async = require('async'); //npm install async

    // empty array for blogEntries
    var blogEntries = [];

    // creating new object within the class for each category, passing in that the objects have
    // project, date, skills, etc. as properties
    class BlogEntry {
      constructor(project, date, skills, content, reflections) {
        this.project = {};
        this.project.S = project;
        this.date = {}; 
        this.date.S = date;
        this.skills = {};
        this.skills.SS = skills;
        this.content = {};
        this.content.S = content;
        this.reflections = {};
        this.reflections.S = reflections;
      }
    }

    //pushing three blogpost items to the empty array above. they are being held in an array
    // as a staging area before putting to dynamo.

    blogEntries.push(new BlogEntry(
        'AA interactive map',
        'August 20, 2019',
        ["javascript", "data acquisition", "web scraping"],
        'Through this assignment, students are opened up to the concept of data acquisition, one of the first processes in creating a data visualization. In this case, our task is to create a Javascript code that extracts HTML body text from ten different NYC Alcoholics Anonymous websites, writes ten new .txt files corresponding to each website, and stores them all in a specific directory.',
        'This was the first assignment of the year and was extremely difficult and time-consuming to figure out! However, I learned a lot and understand the concept of putting in the personal time if I want to learn javascript. It was also satisfying to output a large .txt full of raw content!'
        ));


    blogEntries.push(new BlogEntry(
        'AA interactive map',
        'September 9th, 2019',
        ["javascript", "parsing"],
        'As a follow up from last week\'s assignment, students are given the opportunity to extract specific data from large, unorganized HTML body text. The students are challenged to isolate the information requested and organize in a neat, line-by-line text file of addresses. Scraping, parsing, and string editing tools are explored in this assignment.',
        'This assignment felt very difficult at first, but once I discovered some tricks and tips to edit strings and target certain tags in an html, everything started to come together. It felt good to see an organized file of all the addresses of concern at the end.'
        ));

    blogEntries.push(new BlogEntry(
        'AA interactive map',
        'September 16th, 2019',
        ["javascript", "geocoding", "json format"],
        'In this week\'s assignment, students are tasked to request coordinates from Texas AM geocode API and pair them with their respective addresses. The input .txt is from last week’s assignment of neatly organizing addresses derived from the AA html.',
        'I really liked this assignment. Coming from a GIS background, it was interesting to understand the approach to geolocate/geocode with javascript. I also had never dealt with json files before so it was cool to practice with them.'
        ));

    // console.log(blogEntries);

### Part Three:

After each of the three blogposts are added to the blog entry array, it is time to start adding them to the database. The aws-sdk dependancy is set up, AWS is configured, and a dynamo db variable is defined to accept the blog entries for the database. Async is used to loop through each blog post entry every half a second, adding to the var dynamodb variable after the 'params' are populated by the categories of each blog post.

    //aws-sdk dependency and contacting amazon
    var AWS = require('aws-sdk'); //npm install aws-sdk
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    //access dynamo
    var dynamodb = new AWS.DynamoDB();

    //matching each blog entry item with the para needed for input to dynamo DB
    //and then send each entry to dynamo DB every half second (through putItem, then setTimeout:500) .
    
    async.eachSeries(blogEntries, function(entry, callback) {

            var params = {};
            params.Item = entry; 
            params.TableName = "processBlogJO";

            dynamodb.putItem(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });

            setTimeout(callback, 500)
    });
