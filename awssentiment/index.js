"use strict"
const aws = require("aws-sdk");
const config = require("./config.json");
const input = require("./input.json");
const fs = require('fs');
console.log("Number of records:" + input.length);

var fname = 'test-results.txt';

//main 
(async function() {

    try {
        fs.unlinkSync(fname)
        //file removed
    } catch{

    }

    try {

        aws.config.setPromisesDependency();

        aws.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretAccessKey,
            sessionToken: config.aws.sessionToken,
            region: 'us-east-1'
        });

        var comprehend = new aws.Comprehend();

        var getAnswer = async function(i){
            var theText = input[i]['Text'];
            theText = theText.trim();
            if (theText.length >0){
                await comprehend.detectSentiment(input[i], function(err, data) {
                if (err) {
                    console.log(i,err, err.stack); // an error occurred
                 } else {
                    //console.log(i,data); // successful response
                    console.log(i); 
                    let S = 0;
                    if (data.Sentiment == 'POSITIVE'){
                        S = 1;
                    } else if (data.Sentiment == 'NEGATIVE'){
                        S = 0;
                    } else if (data.Sentiment == 'NEUTRAL'){
                        S = 0.5;
                    } else if (data.Sentiment == 'MIXED'){
                        S = 0.5;
                    } else {
                        console.log(data.Sentiment);
                    }
                    fs.appendFileSync(fname, i + "," + S + "," + data.SentimentScore.Positive + "," + data.SentimentScore.Negative + "," + data.SentimentScore.Neutral + "," + data.SentimentScore.Mixed);
                    fs.appendFileSync(fname,'\n');
                 }//end if
                
            }) //end callback function
          } else {
            fs.appendFileSync(fname, i + "," + " " + "," + " " + "," + " " + "," + " " + "," + " ");
            fs.appendFileSync(fname,'\n');
          } //end if !=""
        }

        for (let i = 0; i < input.length; i++) {
            setTimeout(function timer() {
                getAnswer(i);
            }, (i+1) * 2000);
          }

    } catch (e) {
        console.log('our error', e);
    }
})(); //end main
