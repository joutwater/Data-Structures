# AA map

### Project description
This project is the culmination of weekly assignments throughout this course that involved Alcoholics anonymous data sourced from the htmls of multiple AA websites. We have found multiple categories and iterated through multiple data structures in the process. In case you would like more context for this project, please see these pages:

Scraping: week 1
Parsing: week 2
Geocode: week 3
PopulatingSql database: week 4
Querying from database: week 6
Complete AA data to database: week 7
Creating endpoint for databases: week 10

### Process
In this assignment, students are asked to make a webapp that geographically displays AA data and various categories of that data. For my specific project, I decided to create a service that would be used by alcoholics in a potential emergency situation, when a user really needs to go to an AA meeting. This site would be a way for users to see all AA meetings within two hours of the current time. I feel that range is sufficient in giving users a decent range of time to allow them to get to a meeting but not too much time where they think it would be too long from the current time. Of course, the time and location is the most important information for each meeting in this situation, so these are used in the database query to dynamically populate markers on the map depending on when you enter the site (every time you refresh the page, the time will update). Each marker is a meeting location and it will host information like meeting type, group name, and other information that would give a user at least some context for mental preparation before a meeting, if needed. I think it could be helpful to have some of this information, but the location and time will be the categories of most concern. Because I am only querying a small subset of the total meetings, the extra information should not slow down the UX.

The query I used in SQL gets all meeting start times between the current time and two hours from the current time. The main challenge with this query is that I used moment.js to give me current time, but that time format is in 24 hour time vs. the meeting times which use the 12 hour clock system. I had to create a system for changing from AM to PM based on the 24 hour clock. For example, if it is 11:15am, I have to find meetings from that time up until 11:59:59am  and then activate another query to find all meetings from 12:00:00 pm to 1:15 pm. I created “if” statements in the query for the time range from 10am to 12pm and 10pm to midnight, which are the two ranges where this issue comes up. Please see the query below:

// FINAL query: This query attempts to solve the issue of finding time two hours from now when the time is between 10 and 12 and 22 and 24.
// The parsed data is in the 12 hour clock system so I had to tell it to query meetings under certain conditions.
if (hourNumber >= 10 && hourNumber <= 12){var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
                 FROM aaMeetings
                 WHERE (meeting_day = '` + dayString + "' and meeting_start > '" + nowTime + "' and start_AMPM = '" + nowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start < '" + '11:59:00' + "' and start_AMPM = '" + nowAMPM +`')
                 OR (meeting_day = '` + dayString + "' and meeting_start >= '" + '00:00:00' + "' and start_AMPM = '" + twoNowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start <= '" + twoNowTime + "' and start_AMPM = '" + twoNowAMPM +`')
                 GROUP BY latitude, longitude;`;
                 
} else if (hourNumber >= 22 && hourNumber <= 24){var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
                 FROM aaMeetings
                 WHERE (meeting_day = '` + dayString + "' and meeting_start > '" + nowTime + "' and start_AMPM = '" + nowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start < '" + '23:59:59' + "' and start_AMPM = '" + nowAMPM +`')
                 OR (meeting_day = '` + dayStringPlus + "' and meeting_start >= '" + '00:00:00' + "' and start_AMPM = '" + twoNowAMPM +`')
                 AND (meeting_day = '` + dayStringPlus + "' and meeting_start <= '" + twoNowTime + "' and start_AMPM = '" + twoNowAMPM +`')
                 GROUP BY latitude, longitude;`;
    
} else {var aaQuery_1 = `SELECT latitude, longitude, json_agg(json_build_object('loc', location_name, 'address', street_address, 'time', meeting_start, 'AMPM', start_AMPM, 'name', group_name, 'day', meeting_day, 'types', meeting_type)) as meetings
                 FROM aaMeetings
                 WHERE (meeting_day = '` + dayString + "' and meeting_start > '" + nowTime + "' and start_AMPM = '" + nowAMPM +`')
                 AND (meeting_day = '` + dayString + "' and meeting_start < '" + twoNowTime + "' and start_AMPM = '" + twoNowAMPM +`')
                 GROUP BY latitude, longitude;`;
    
}


#### Reflections and room for improvement:

I am really looking forward to aesthetically designing this project further. So far I have chosen a simple black and white background but I would like to add a different marker style and color, and format the information in the pop ups to make the time and location bolded and have the extra information in smaller print. I would also like to add a google maps link that reroutes a user to the google maps site. Finally, a refresh button and AA hotline number would be added (if there happen to be no meetings within the time range).

I am still have some slight querying issues with the 24 and 12 hour format difference. I had tested different times to check that the query was correct, but I forgot to check 12 o’clock pm (the day before the assignment is due!). During that time, Sql doesn’t seem to be able to query from 12 to 1, it has to start from 0 again for the query. I’ve expanded the query to allow some meetings that have already happened in order to allow meetings to display during that range. 

Finally, I have seen some meeting show up in Brooklyn as a result of imperfections during the initial parsing and geocoding process. I will go back to look at what caused the geocoding to be off for these particular sites.

