## Process blog

URL for project site: http://54.235.234.244:8080/blog.html

[Assignment](https://github.com/visualizedata/data-structures/blob/master/final_assignment_2.md)

The process blog project is a result of personal blog posts created throughout the first semester of my program as a data visualization student at parsons. Students are asked to use Dynamo DB to log these blog posts, which is a noSQL database and has certain benefits to SQL. Through this blog, students have been able to learn more about the differences and which situations are more suitable for one type of database or the other. Please view past assignments related to this project

Creating a noSQL database with Dynamo DB and adding blog entries [week05](https://github.com/joutwater/Data-Structures/tree/master/week05)

Executing queries from a noSQL database [week06](https://github.com/joutwater/Data-Structures/tree/master/week06)

Creating endpoints [week10](https://github.com/joutwater/Data-Structures/tree/master/week10)

As I was creating blog posts during my first semester, I decided that a nice topic to write about was a mix of content and reflections. Basically, I wanted to remember what I was doing and how I felt about each of those events. I decided a logical way to do so was to organize the blog posts by project and date, giving me the option to see progress over time and also look at some of my thoughts around particular projects. I gathered text from projects that I completed in all four classes of my first semester and assigned them particular dates around when they were written. I added all of the data to the database, using project as the partition key and date as my sort key. As I got further along in the process, I started to figure out the best method and functionality around querying and viewing the data on a webpage. After talking to Neil and having him describe to me and help me understand his code, I decided to use handlebars and ajax to pass data from the server to the html page. It is a bit more of a complex system but I think that it will be useful in future situations. My query starts with some async awaits as the code runs the query, only being sent to the endpoint with the query and scan complete. I created some parameters for the query, using min and maxDate along with project name, as these are the primary categories I want to organize in my interface. 

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
(Please see code 201-285 for app.js code specific to this project. Also please see processblog.html as handlebar template, blog.js as jquery using ajax, blog.html as additional html hosting final html page with dropdown menu in the process blog, and finally stylesBlog.css. A lot of files working in unison!)

The queried items are then placed in an array for output with values for each category, the template for the process blog is read in, and the data is sent to the endpoint. A jquery script and secondary html script are then introduced to create a category dropdown list to choose blog posts by the list of project names I created. The great part about ajax and handlebars is that the entire html page doesn’t need to be replaced, but just certain tags of the html can be replaced. I can see this being really useful when dealing with larger queries and websites with higher demand. Please see the diagram below that has helped me understand the system in use for the process blog website.

![Image](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/ajax_diagram.png)

My idea in binding data to the end-user interface is that myself or a user can simply navigate my blog posts by project, and within that query, automatically have a list in chronological order. I do not want to overcomplicate the system, just share some of my thoughts in a clean, legible format. At some point, I would like to be able to sort by date as well, but I was not able to add that functionality at this point in time. I would also like to be able to control what category is displayed in the default view, or maybe being able to show all of the posts at first and have them reshuffle each time the page is reloaded.


![Image](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_2/PB_ss.png)

I generally really enjoyed the process behind this project, not only as a way to inheretnly reflect on the semester but also as a way to learn a new functionality with ajax. I am excited to learn more about it and hopefully continue my blogs into the coming year.
