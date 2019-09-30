# Week 5 Assignment
## Creating a noSQL database with Dynamo DB and adding blog entries

### Part One: Plan
The noSQL database created this week is quite different to the normalized database I skecthed for last week's assignment with the AA data. The process blog data does not need to have as many relations between multiple tables, with the only real organization being by project (partition key) and then by date (sort key). The AA data requires much more complex relations in my opinion.

1. I will use a denormalized data model for the process blog because I want fewer rules about structure and, therefore, more ease in adding new information and faster queries.

2. When the data comes out, I would want data from a certain blog post to be structured like this:<br/>
                BlogEntry {<br/>
                    ‘Project’ : 'AA interactive map'<br/>
                    ‘Date’ : 'September 16th, 2019'<br/>
                    ‘Skills’ : ‘javascript’<br/>
                    ‘Content’ : ‘text...’<br/>
                    ‘Reflections’ : ‘text…’<br/>
                }<br/>
  The data does not need to be in an elaborate table like other database outputs. As the example shows, I imagine the user only wanting relatively simple information through an easy search. To my understanding, these qualitites reflect the purpose of a noSQL database. 
  
3. The hierarchy of the data is limited to the categrories of project, date, and everything else. I designed the database to group each post by project (partition key) and then by date (sort key) within each project. After project and date categories are defined, every other category has the same value in terms of hierarchy level.

### Part two:
