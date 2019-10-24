# Week 7 Assignment
## Parsing and Geocoding All Zones for Input to PostgreSQL

Before starting to play with code in this assignment, I spent a lot of time thinking about the database structure and how I want the map to be organized. It was difficult to imagine how everything would come together, especially after spending so much thought and effort on correctly organizing the noSQL database. After awhile, I began to make the distinction and plan for my AA data. I knew I wanted to create a relational database so I began to break up the data in groups like location, group, and meeting times. I followed this with some research on Primary keys and Foreign keys and decided to have a the location id and group id be primary keys in a table holding the meeting info / times. Below is the structure I created:

![alt text]"

### Part One: Parse
