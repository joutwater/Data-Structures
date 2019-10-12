    // npm install aws-sdk
    var AWS = require('aws-sdk');
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "processBlog_JO",
        // search by project as parition key and then date by sort key (secondary search) within a certain range
        KeyConditionExpression: "#project = :projectName and #date between :minDate and :maxDate", // the query expression can use "between" for greater than or equal to each minDate and maxDate, but not for ISOString
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#project" : "project"
            ,"#date" : "date"
        },
        ExpressionAttributeValues: { // the query values
            ":projectName": {S: "AA interactive map"}
            ,":minDate": {S: new Date("2019-08-19").toISOString()}
            ,":maxDate": {S: new Date("2019-09-17").toISOString()}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log("***** ***** ***** ***** ***** \n", item);
            });
        }
    });
