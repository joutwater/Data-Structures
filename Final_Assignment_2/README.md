## Process blog

URL for project site: http://54.235.234.244:8080/blog.html

[Assignment](https://github.com/visualizedata/data-structures/blob/master/final_assignment_2.md)

The process blog project is a result of personal blog posts created throughout the first semester of my program as a data visualization student at parsons. Students are asked to use Dynamo DB to log these blog posts, which is a noSQL database and has certain benefits compared to SQL. Through this blog, students have learned more about the differences between the two and which situations are more suitable for one type of database or the other. Please view past assignments related to this project if you would like more context:

Creating a noSQL database with Dynamo DB and adding blog entries [week05](https://github.com/joutwater/Data-Structures/tree/master/week05)

Executing queries from a noSQL database [week06](https://github.com/joutwater/Data-Structures/tree/master/week06)

Creating endpoints [week10](https://github.com/joutwater/Data-Structures/tree/master/week10)

As I was creating blog posts during my first semester, I decided that a nice topic to write about was a mix of content and reflections. Basically, I wanted to remember what I was doing and what I was thinking during some of these events. I decided a logical way to do so was to organize the blog posts by project and date, giving me the option to see progress over time and also look at some of my thoughts around particular projects. I gathered text from projects that I completed in all four classes of my first semester and assigned them particular dates around when they were written. I added all of the data to the noSQL database, using project as the partition key and date as my sort key. As I got further along in the process, I started to figure out the best method and functionality around querying and viewing the data on a webpage. After talking to Neil and having him describe to me his code, I decided to use handlebars and ajax to pass data from the server to the html page. This will be useful in binding the data to the user-interface because the final html page doesn't have to be reloaded each time a new category is selected, only specific tags in the html are edited. It is a bit more of a complex system but I am excited to learn more about how this system works, especially for application in projects with more data. My query starts with async awaits as the code runs the query, only being sent to the endpoint with the query and scan complete. I created some parameters for the query, using min and maxDate along with project name, content as skills, as these are the primary categories I want to organize in my interface. 

    var params = {
                    TableName: "processBlog_JO",
                    ProjectionExpression: "#p, #d, content, skills",
                    FilterExpression: "#d between :minDate and :maxDate",
                    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
                    "#p" : "project"
                    ,"#d" : "date"
                    },
                     ExpressionAttributeValues: { // the query values
                        ":minDate": {S: new Date(minDate).toISOString()},
                        ":maxDate": {S: new Date(maxDate).toISOString()}
                    }
                };
                
(Please see code 201-285 for [app.js](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/app.js) code specific to this project. Also please see [processblog.html](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/processblog.html) as handlebar template, [blog.js](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/blog.js) as jquery using ajax, [blog.html](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/blog.html) as additional html hosting final html page with dropdown menu in the process blog, and finally [stylesBlog.css](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/stylesBlog.css). A lot of files working in unison!)

My thinking behind how I binded data and designed the end-user interface is that myself or another user can quickly navigate my blog posts by project, and within that query, automatically have a list in chronological order. I do not want to overcomplicate the system, just share some of my thoughts in a clean, legible format. At some point, I would like to be able to sort by date as well, but I was not able to add that functionality at this point in time. I would also like to be able to control what category is displayed in the default view, or possibly be able to show all of the posts in a random order each time the page is loaded.

![Image](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/PB_ss.png)

### Reflections

I really enjoyed the process behind this project, not only as a way to inherently reflect on the semester but also as a way to learn a new functionality with ajax. I am excited to learn more about it and hopefully continue my blogs into the coming year.

Ajax diagram
![Image](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/ajax_diagram.png)
