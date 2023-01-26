// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
// added in: body-parser, fetch
const bodyParser = require('body-parser');
const fetch = require('cross-fetch');

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging

app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(express.json());
app.use(function(req, res, next) {
  console.log("...Incoming request body contains:",req.body);
  next();
});

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
//app.use(function(req, res, next) {
//  res.json({msg: "No such AJAX request"})
//});

app.post("/query/test", async function(req, res, next) {
  let text = req.body;
  //console.log("...Performing database lookup");
  let year = text.year;
  let month = text.month;
  //console.log("...Year",year,"Month",month);
  let date;
  if (month < 10) {
    date = year+'-0'+month+'-01';  // 2022-04-01 for example
  } else {
    date = year+'-'+month+'-01';  // 2022-12-01 for example
  }
  //console.log("...Date format:",date);
  //let date = year+'-'+month+'-01';  // 2022-03-01 for example
  let url = getURL(date);
  let object = await databaseLookup(url);
  //console.log("...",object.length, " objects found at URL");
  res.send(object);
})

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

// FUNCTIONS FOR DATABASE LOOKUP

function getURL(date) {  // string '2022-03-01' for example
  let api_url = 'https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start='+date+'&End='+date;
  //console.log("...URL found:",api_url);
  return api_url;
}

async function databaseLookup(url) {
  let lookup = await fetch(url);
  let obj = await lookup.json();
  return obj;
}

//async function 

// Shasta Oroville, month of January 2022 reservoir storage monthly reading
//https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO&SensorNums=15&dur_code=M&Start=2022-01-01&End=2022-01-01
// or end date 31st - same result

// https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=2022-04-01&End=2022-04-01
// April 2022 for 7 reservoirs