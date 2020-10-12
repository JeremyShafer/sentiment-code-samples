"use strict"
const inputfilename = 'source3';
const input = require("./"+ inputfilename +".json");
const fs = require('fs');
console.log("Number of records:" + input.length);
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '';
const endpoint = '';
const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));
var fname = inputfilename + '-results.txt';

//main
async function sentimentAnalysis(client){

    try {
        fs.unlinkSync(fname)
        //file removed
    } catch {

    }

    try {

        var getAnswer = async function(i){
            console.log(i)
            let document = []
            document[0] = input[i]["Text"];
            if (document[0].length >0){
                const sentimentResult = await client.analyzeSentiment(document);
                //console.log(sentimentResult);
                let S = 0;
                let sentiment = sentimentResult[0]['sentiment'];
                if (sentiment == 'positive'){
                    S = 1;
                } else if (sentiment == 'negative'){
                    S = 0;
                } else if (sentiment == 'neutral'){
                    S = 0.5;
                } else if (sentiment == 'mixed'){
                    S = 0.5;
                } else {
                    console.log(sentimentResult);
                    console.log("******"+sentiment);
                }
                fs.appendFileSync(fname, i + "," + S );
                fs.appendFileSync(fname,'\n');

            } else {
                fs.appendFileSync(fname, i + "," + " ");
                fs.appendFileSync(fname,'\n');
            } //end if !=""

        }

        for (let i = 0; i < input.length; i++) {
            setTimeout(function timer() {
                getAnswer(i);
            }, (i+1) * 2000);
        }

    } catch(e) {
        console.log('our error', e);
    }

}

sentimentAnalysis(textAnalyticsClient)