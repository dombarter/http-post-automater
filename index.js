// var readline = require("readline"); //imports
// var request = require("request");
// var roundTo = require('round-to');

// function writeWaitingPercent(p) { //updates the console
//     readline.clearLine(process.stdout);
//     readline.cursorTo(process.stdout, 0);
//     process.stdout.write(`${p}% Complete`);
// }

// var counter = 0; //current iteration
// var total = 150; //total number to register
// var successful = 0; //total number of successful hits

// function registerUser(){ //register user function
//     var userToRegister = {
//         apiPassword:"api-pass-123",
// 	    name:`User ${counter}`,
// 	    email:`${counter}@insight.com`,
// 	    password:"password123",
// 	    code:"insight-walking-app"
//     }

//     return new Promise(function(resolve,reject){
//         request({ // post the data to the api
//             url: "https://i7lis7jv3f.execute-api.eu-west-2.amazonaws.com/prod/users/register",
//             method: "POST",
//             json: true, 
//             body: userToRegister
//         }, 
//         function (error, response, body){
//             if(body.success === false){ //if there was an error redirect to index
//                 reject(false);
//             }
//             else{
//                 resolve(true);
//             }
//         });
//     })
    
// }

// function main(){ //main function

//     writeWaitingPercent(0);
//     var interval = setInterval(async function(){
//         if(counter === total){
//             clearInterval(interval);
//             console.log("\n\nFinished!")
//             console.log(`${(successful/total)*100}% Successful`); //final print
//         }
//         else{
//             await registerUser().then(function(success){
//                 successful = successful + 1;
//                 counter = counter + 1;
//                 writeWaitingPercent(roundTo((counter/total)*100,2));
//             }).catch(function(failed){
//                 counter = counter + 1;
//                 writeWaitingPercent(roundTo((counter/total)*100,2));
//             });
//         }
//     },7500)  

    
// }

// main();

exports.helloWorld = function(){
    console.log("Hello World!");
}