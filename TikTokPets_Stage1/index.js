const express = require("express");
const bodyParser = require('body-parser');  // ADDED FROM INPUT EXAMPLE
const app = express();  // interface to express for server code

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})  // print method (GET or PUT), url it's asking for - this data is attached to object req
// anonymous function expression being used as argument to app.use()

app.use(express.static("public")); // make "public" dir available on internet

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tiktokpets.html");
}); // when no file specified, return the main page of the app


app.use(bodyParser.text()); // ADDED FROM INPUT EXAMPLE - gets text out of the HTTP body and into req.body

// ADD IN: response if page not found

// END OF PIPELINE SPECIFICATION

// app.post("/videoData", function(req,res,next) {  // ADDED FROM BROWSER REDIRECT EXAMPLE
//   let choice = req.body; // user's choice
//   console.log("responding",choice);
//   res.send(choice);
// })



// app.post('/videoData', function(req, res, next) { // ADDED IN FROM INPUT EXAMPLE
//   console.log("Server recieved a post request at", req.url);
//   let text = req.body;
//   console.log("It contained this string:",text);
//   res.send("I got your POST request");
// }); // server recieves and responds to POST requests

app.post('/videoData', function(req, res, next) {  // ADDED FROM POST EXAMPLE
  console.log("Server recieved a post request at", req.url);
  let text = req.body;
  console.log("It contained this string:",text);
  res.send("I got your POST request");
});

const listener = app.listen(3000, function(){
  console.log("Static server listening on port " + listener.address().port);
}); // listen for HTTP requests



