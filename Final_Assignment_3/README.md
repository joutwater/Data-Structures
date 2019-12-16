# What’s Cookin’?

URL to project site: http://54.235.234.244:8080/sensordata

### Project Description
This project is the culmination of past weekly assignments that focused on setting up an ioT sensor and logging temperature and time readings to a database. We had the sensor running for about thirty days and were collecting readings every five minutes. Depending on where you placed your sensor, you could tell a particular story about the world around the sensor. Please see the previous weekly [assignment](https://github.com/joutwater/Data-Structures/tree/master/week09) for more context surrounding this project.

At the outset of this project, I had an idea to place the temperature sensor by the stovetop in my apartment to see how often I was cooking throughout the month. I’ll tell you now, I don’t have as much time to cook now that I am in graduate school, but I was interested to see how my cooking patterns changed throughout a month. I stayed with logging the temperature every 5 min and made some particular choices around what aspects of the data I wanted to log. I chose to save the temperature, year, month, day, and time in order to create the test I wanted to see. I imagined that these categories would be sufficient enough in creating a line graph that would show the data and time-specifics I wanted. Once all the data had been logged, I created an endpoint for the webapp and started playing with different queries as I began to figure out code for the visualization using d3. I began to reconstruct dates and hours in the query and found that I wanted to visualize temperatures looking at particular hours during each day. I realized that it would be really cool to show the temperatures at the same hour each day throughout the thirty days, and be able to dynamically display which hour was being shown. For example, I open the viz and look at the average temperatures at 8pm throughout the month, and I can see that I was cooking at 8pm on the days with high temperature readings.

![Image](https://github.com/joutwater/Data-Structures/blob/master/Final_Assignment_3/Sensor_ss.png)

A few more notes on the query: I used SQL to get the year, month, day, AVG temperature value for each hour, and extracted the hour from each timestamp. I made these values into integers and then grouped them by their individual entries and ordered them by time. Once in d3, I used another process to create a time format that was more manageable for use in d3. From there, I began to create a line graph of the data, first with everything, not selecting by particular hour. Then, I started to isolate hours from each day and create a system that would select temperature values by an hour that is defined in a dropdown list on the website. 

      var sensorQuery_1 = `WITH times as (
                                SELECT sensorYear::int,
                                  sensorMonth::int,
                                  sensorDay::int,
                                  EXTRACT (HOUR from sensorTime)::int as sensorHour,
                                  sensorValue
                                FROM sensorData
                                )
      
                                SELECT sensorYear,
                                  sensorMonth,
                                  sensorDay,
                                  sensorHour,
                                  AVG(sensorValue::int) as tempvalue
                                  FROM times
                                  GROUP BY sensorYear, sensorMonth, sensorDay, sensorHour
                                  ORDER BY sensorYear, sensorMonth, sensorDay, sensorHour;`;
                                  
(Please see lines 164-199 in app.js for the code specific to this project. Also please view sensor.html for the template. I used handlebars to connect the queried data to the template for the final interface). 

### Reflections and room for improvement:

I really enjoyed creating this graph, especially when I figured out how to create the animation between line updates in d3. I think this visualization could be adapted in a restaurant kitchen or even in apartments to understand temperature rhythms, which could save energy and money. I am pleased with how my interface reflects the strategy I took in organizing my data and expressing a story about my cooking cycles. Some areas of improvement for me would be the accuracy of time (as usual) and the precise positioning of the line along the graph. I logged all of my time in GMT and haven’t quite figured out the best way to translate that to east coast time. Regarding graph position, the first day of logging doesn’t have a full day’s worth of hours (I started logging at 6pm), so there is a gap on the left of the graph. Also, the position of the graph shifts slightly for each hour, so I want to find a way to center each temperature point over its respective day. Finally, I want to do more research to find the exact threshold of when I was or wasn’t cooking so that I can draw a line across the graph that would separate cooking and not cooking more clearly. Of course, there is more styling to do here so I plan to work on it over the break! 

