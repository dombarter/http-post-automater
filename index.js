var readline = require("readline"); //imports
var request = require("request");
var roundTo = require('round-to');
var fs = require("fs");

var filePath = "";

function writeWaitingPercent(p,currentCounter,total,delay) { //updates the console
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);

    var totalSeconds = (total*delay);
    var secondsPassed = (currentCounter*delay);
    var deltaTime = totalSeconds - secondsPassed;
    var minutes = Math.floor(deltaTime/60);
    var seconds = Math.round(deltaTime%60);

    process.stdout.write(`${p}% Complete | ${minutes}min, ${seconds}secs remaining`);
}

function updateLogs(dataToPost,response,counter){
    var one = (`POST request number ${counter + 1}: ==========================`);
    var two = (`POSTED data:`);
    var three = (`${JSON.stringify(dataToPost)}`);
    var four = (`RESPONSE data:`);
    var five = (`${JSON.stringify(response)}`);

    var dataToWrite = `\n${one}\n\n${two}\n${three}\n\n${four}\n${five}\n`;
    fs.appendFile(filePath,dataToWrite,function(error){
        //error
    })
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

    if(options.delay < 1){options.delay = 1; console.log("Delay was set to default value of 1 second")};
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
                resolve(body)
            })
        })
    }

    // set up the intial progress bar

    writeWaitingPercent(0,0,(options.number + 1),options.delay);

    // set up the base variables

    var counter = 0; //current iteration
    var total = options.number; //total number to post
    var dataToPost;
    filePath = `logs-${new Date().getTime()}.txt`;

    // begin posting the data

    return new Promise(function(resolve,reject){
        var interval = setInterval(async function(){
            if(counter === total){
                clearInterval(interval)
                console.log("\n\nFinished!");
                console.log(`Logs available in /${filePath}`);
                resolve(true);
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
    
                var postResponse = await postData(dataToPost);
                updateLogs(dataToPost,postResponse,counter);
                counter = counter + 1;
                writeWaitingPercent(roundTo((counter/total)*100,2),counter,(total + 1),options.delay);
            }
        }, (options.delay * 1000))
    })
}

// var options_1 = {
//     number: 5,
//     delay: 2,
//     endpoint: "https://i7lis7jv3f.execute-api.eu-west-2.amazonaws.com/prod/users/register",
//     data:{
//         apiPassword:"api-pass-123",
//         email:"<% numerical %>@insight.com",
//         password:"password123",
//         name:"User <% numerical %>",
//         code:"insight-walking-app",
//     }
// }

// exports.start(options_1);