# Week 11 Assignment
## Interface Design for Three Data Sources

In this week's [assignment](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_11.md), students are tasked with designing sketches for the final three projects: AA Meetings, Sensor Data, and Process Blog databases.

### Part One: Sensor Data

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week11/Sensor_Mock.png)

#### What will the visualization look like? Will it be interactive? If so, how?
The visulization will look like a line graph showing the rise and fall of temperatures throughout the day, hopefully offering insights about how often the kitchen is used in my apartment. The y axis is temperature (I still have to find the best temperature range) and the x axis is time. I would want to display as many readings as possible in order to get a cool effect for the line graph. I've drawn two horizontal lines, one for average temperature and one for showing that the kitchen is likely in use above a certain temperature. It could be interactive by hovering over points along the line which would show the temperature and date.
#### How will the data need to be mapped to the visual elements?
The data will be mapped based on the temperature value and time. I will use retinal values of position and color to express visual differences and hierarchies
#### For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
I don't see much extra restructuring needed in this situation. I will filter the temperature, date, hour, and minute for each reading, mapping time to the x-axis and temperature to the Y axis. I will make a query based on this and then I could make a javascript or p5 code that will place the point values on an XY plane correctly
#### What is the default view (if any)?
Default view will be the line graph, maybe having the line connect point to point across the screen when it opens. it will show the cooking threshold and average temperature line.
#### What assumptions are you making about the user?
I am assuming that the user would be interested to see when I cooked throughout a month and what that could say about the cooking patterns of others. I want to have the tool tip so a user can easily see the temperatures and dates at certain times.

### Part Two: AA Data

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week11/AA_Mock.png)

#### What will the visualization look like? Will it be interactive? If so, how?
This visualization will be an interactive map, using mapbox or leaftlet. There will be a search bar at the top where you can either write in location, meeting name, meeting type, meeting time and then the map will return the query of locations with whatever conditions are specified. You can click a point and it will give you all informatiomn about that point including a link with directions to get there.
#### How will the data need to be mapped to the visual elements?
All data will be mapped by lat and long, so not matter what is typed, there will be a spatial component. A single location can have multiple meetings and vice versa, and those would all pop up even when only a single location is clicked. So data would be mapped to the pop up text as well.
#### For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
For whatever is searched or queried, the longitude and latitude connected to that data point will always have to be present for spatial display. So lat long will have to be populated in a query every time. I imagine this would happen in a similar way to querying and returning an entire entry, searching for the lat/long within that entry for a point location, and creating a text box pop up for an on-click interaction at that location. There will also have to be someway to get the directions data link, possibly from an outside source like a link to google maps. There would also have to be some aagregation of data when a query returns multiple entries to the same location.
#### What is the default view (if any)?
The default view would be a map view of manhattan with an empty search bar at the top
#### What assumptions are you making about the user?
I am assuming the user is an alcoholic looking for the best place to join an AA meeting. There are many types of user goals in this context, so I am trying to give a potential user as many search options as possible.

### Part Three: Process Data

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week11/Process_Mock.png)

#### What will the visualization look like? Will it be interactive? If so, how?
The visualization for the process blog would look like a simple search site that displays text in the middle. It would be interactive in that you can search for various projects and dates by selecting from a drop down menu. Combining those together would create a single query request and display the text in the box to be read
#### How will the data need to be mapped to the visual elements?
The data would be mapped to the viz in the search options dropdown for the project and date searches. The data would also be mapped to the viz in the text display box. The visual is mostly text in this situation.
#### For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
I need to be able to have all potential date and project options be mapped to the dropdown search. This will require a query of each individual project name and month/year which would then be populated in the drop down and click-able for user querying. The main body text will populate from whatever query is selected, with those answers somehow being dynamically entered to a query with containers filled by the query specifics.
#### What is the default view (if any)?
The default view would be what is displayed in the mock up, with an empty text box and possibly an example project and date filled into the search options.
#### What assumptions are you making about the user?
I assume that the user is interested in learning more about my projects at parsons throughout the program. I think that I will be a user as well, looking back on different projects to remember my thinking and approach to these projects
