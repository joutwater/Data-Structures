# Week 11 Assignment
## Interface Design for Three Data Sources

In this week's [assignment](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_11.md), students are tasked with designing sketches for the final three projects: AA Meetings, Sensor Data, and Process Blog databases.

### Part One: Sensor Data

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week11/Sensor_Mock.png)

#### What will the visualization look like? Will it be interactive? If so, how?
The visulization will look like a line graph showing the rise and fall of temperatures throughout the day, hopefully offering insights about how often the kitchen is used in my apartment. The y axis is temperature (I still have to find the best temperature range) and the x axis is time. I would want to display as many times as possible in order to get a cool effect for the line graph. I've drawn two lines, one for average temperature and one for showing that the kitchen is likely in use above a certain temperature. It could be interactive by hovering over points along the line which would show a tool tip for the temperature and date.
#### How will the data need to be mapped to the visual elements?
The data will be mapped based on the temperature value and time. I will use retinal values of position and color to express visual differences and hierarchies
#### For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
I don't see much extra restructuring needed in this situation. I will filter the temperature, date, hour, and minute for each reading, mapping time to the x-axis and temperature to the Y axis. I will make a query based on this and then I could make a javascript or p5 code that will place the point values on an XY plane correctly
#### What is the default view (if any)?
Default view will be the line graph, maybe having the line fill point to point across the screen when it opens. it will show the cooking threshold and average temperature line.
#### What assumptions are you making about the user?
I am assuming that the user would be interested to see when I cooked throughout a month and what that could say about the cooking patterns of others. I want to have the tool tip so you can easily see the temperatures and dates at certain times.

### Part Two: AA Data

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week11/AA_Mock.png)

### Part Three: Process Data

![alt text](https://github.com/joutwater/Data-Structures/blob/master/week11/Process_Mock.png)
