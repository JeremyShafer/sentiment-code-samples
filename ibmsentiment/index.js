"use strict"
const inputfilename = 'source3';
const input = require("./"+ inputfilename +".json");
const fs = require('fs');
console.log("Number of records:" + input.length);
var fname = inputfilename + '-results.txt';
const config = require("./config.json");

//IBM Watson NLP setup
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: config.apikey,
  }),
  serviceUrl: config.url,
});

//main 
(async function() {

    try {
        fs.unlinkSync(fname)
        //file removed
    } catch{

    }

    try {

        var getAnswer = async function(i){
            console.log(i)
            
            let document = {
                'text': '',
                'features': {
                  'sentiment': {}
                }
              };

            document.text = input[i]["Text"];

            if (document.text.length > 0 ){

                let sentimentResult = await naturalLanguageUnderstanding.analyze(document);

                //console.log(sentimentResult.result.sentiment.document.label);
                
                let S = 0;
                let sentiment = sentimentResult.result.sentiment.document.label;
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
        console.log('Error Detail', e);
    }

})(); //end main