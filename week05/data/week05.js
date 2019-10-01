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

      //pushing three blogpost items to the empty array above. they are being held in an array as staging area before pushing to dynamo.

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

      //aws-sdk dependency and contacting amazon
      var AWS = require('aws-sdk'); //npm install aws-sdk
      AWS.config = new AWS.Config();
      AWS.config.region = "us-east-1";

      //access dynamo
      var dynamodb = new AWS.DynamoDB();

      //gathering items from each blog post entry for input to dynamo DB
      //then send each entry to dynamo DB (through put item). Repeat every half second (setTimeout:500) .
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
