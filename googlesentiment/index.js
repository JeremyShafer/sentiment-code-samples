"use strict"
const inputfilename = 'source3';
const input = require("./"+ inputfilename +".json");
const fs = require('fs');
console.log("Number of records:" + input.length);
var fname = inputfilename + '-results.txt';

// Imports the Google Cloud client library
const language = require('@google-cloud/language');
// Creates a client
const client = new language.LanguageServiceClient();


//main
(async function (){

    try {
        fs.unlinkSync(fname)
        //file removed
    } catch {
    }

    try {

        var getAnswer = async function(i){
            console.log(i)

            let text = input[i]["Text"];
            let document = {
                content: text,
                type: 'PLAIN_TEXT',
              };

            //console.log(document);

            if (text.length > 0 ){
                const [result] = await client.analyzeSentiment({document});
                const sentiment = result.documentSentiment;  
                    //score will have range of -1 (negative) to 1 (positive)
                //console.log(result)
                //console.log(sentiment);
                
                let S = (sentiment.score + 1)/2;  //converting to a 0 to 1 scale
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

})();