var readline = require("readline"); //imports
var request = require("request");
var roundTo = require('round-to');

function writeWaitingPercent(p) { //updates the console
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${p}% Complete`);
}

exports.helloWorld = function(){
    console.log("Hello World!");
}

// Main Start Function ------------------------------------

exports.start = function(options){

    // verify that all components are present in options

    var missingComponents = [];
    if(options.number === undefined){missingComponents.push("number")}
    if(options.delay === undefined){missingComponents.push("delay")}
    if(options.endpoint === undefined){missingComponents.push("endpoint")}
    if(options.data === undefined){missingComponents.push("data")}

    if(missingComponents.length > 0){
        console.error("You have missing elements from options: ");
        console.error(JSON.stringify(missingComponents));
        return false;
    }

    // default certain items to their standard values

    if(options.delay < 5){options.delay = 5; console.log("Delay was set to default value of 5 seconds")};
    if(options.number < 1){options.number = 1; console.log("Number was set to defualt value of 1")};

    // find the prperties with the wildcard property

    var allProperties = Object.getOwnPropertyNames(options.data);
    var wildcardProperties = [];
    for(var i = 0; i < allProperties.length; i++){
        if(isNaN(options.data[allProperties[i]])){
            if(options.data[allProperties[i]].search("<% numerical %>") !== -1){
                wildcardProperties.push(allProperties[i]);
            }
        }
    }

    // set up the basic post function

    function postData(dataToPost_){
        return new Promise(function(resolve,reject){
            request({
                url:options.endpoint,
                method:"POST",
                json: true,
                body: dataToPost_,
            },
            function(error,response,body){
                resolve(true)
            })
        })
    }

    // set up the intial progress bar

    writeWaitingPercent(0);

    // set up the base variables

    var counter = 0; //current iteration
    var total = options.number; //total number to post
    var dataToPost;

    // begin posting the data

    var interval = setInterval(async function(){
        if(counter === total){
            clearInterval(interval)
            console.log("\n\nFinished!");
        }
        else{
            // create the data to post
            dataToPost = {}; //makes empty object

            for(var j = 0; j < allProperties.length; j++){ //creates new obejct properties
                dataToPost[allProperties[j]] = options.data[allProperties[j]];
            }

            if(wildcardProperties.length > 0){ //assigns all wildcards
                for(var i =0; i < wildcardProperties.length; i++){
                    dataToPost[wildcardProperties[i]] = (dataToPost[wildcardProperties[i]]).replace("<% numerical %>",`${counter}`);
                }
            }

            await postData(dataToPost)
            counter = counter + 1;
            writeWaitingPercent(roundTo((counter/total)*100,2));
        }
    }, (options.delay * 1000))
}