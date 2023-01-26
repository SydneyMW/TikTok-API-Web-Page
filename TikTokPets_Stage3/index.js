'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

app.get("/getTwoVideos", async function(req, res) {
  try {
    console.log("...Attempting to fetch 2 random videos");
    let max = await getNumVideos();
    let randInt1 = getRandomInt(max);
    let randInt2 = getRandomInt(max);
    while (randInt1 == randInt2) {
      randInt2 = getRandomInt(max);
    }
    let table = await dumpTwoVideos(randInt1, randInt2);
    console.log("...Two videos found");
    //console.log("...Two videos found: ",table);
    res.send(table);
  } catch(err) {
    console.log("Error: ",err);
    //res.send("Error with GetTwoVideos: ", err);
  }
});

// add preference to database
app.post("/insertPref", async function(req, res) {
  console.log("...Loading insertPref");
  try {
    let better = req.body.better;
    let worse = req.body.worse;
    console.log("Preference: ", better," better than ",worse);
    await insertPreference(better, worse);
    let prefTable = await dumpPrefTable();
    console.log("Number of preferences:",prefTable.length);
    if (prefTable.length < 15) {
      res.send("Continue");
    } else {
      res.send("Pick winner");
    }
  } catch(err) {
    res.send("Error");
  }
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // winner contains the rowId of the winning video.
    let winner = await win.computeWinner(8,false);  // winner: 8 (rowIdNum)
    // given id, fetch url and nickname of winner
    let object = await fetchVideo(winner);
    /*
    let url = await fetchUrl(winner);
    let nickname = await fetchNickname(winner);
    let object = ({winner: winner, url: url, nickname: nickname});
    */
    console.log(object[0]);
    res.json(object[0]);
  } catch(err) {
    console.log("Error",err);
    res.status(500).send(err);
  }
});


// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


/* DEFINE ASYNC DB FUNCTIONS */

async function getNumVideos() {
  const sql = 'select * from VideoTable';
  let result = await db.all(sql);
  return result.length;
}

async function dumpTwoVideos(randInt1, randInt2) {
  let rowIds = await dumpIds();
  let id1 = rowIds[randInt1].rowIdNum;
  let id2 = rowIds[randInt2].rowIdNum;
  const sql = 'select * from VideoTable where rowIdNum in (?,?)';
  let result = await db.all(sql, [id1, id2]);
  return result;
}

async function dumpTable() {
  const sql = 'select * from VideoTable';
  let result = await db.all(sql);
  return result;
}

async function dumpPrefTable() {
  const sql = 'select * from PrefTable';
  let result = await db.all(sql);
  return result;
}

async function insertPreference(better, worse) {
  const sql = 'insert into PrefTable (better, worse) values (?,?)';
  await db.run(sql, [better, worse]);
  //const insertVideo = "INSERT INTO VideoTable (url, nickname, userid, flag) values (?, ?, ?, ?)";
  //insertVideo, [url, nickname, userid, 1]
}
/*
async function fetchUrl(id) {
  const sql = 'select url from VideoTable where rowIdNum = ?';
  let result = await db.get(sql, [id]);
  return result.url;
}

async function fetchNickname(id) {
  const sql = 'select nickname from VideoTable where rowIdNum = ?';
  let result = await db.get(sql, [id]);
  return result.nickname;
}
*/
async function fetchVideo(id) {
  const sql = 'select * from VideoTable where rowIdNum = ?';
  let result = await db.all(sql, [id]);
  return result;
}

async function dumpIds() {
  const sql = 'select rowIdNum from VideoTable';
  let result = await db.all(sql);
  return result;
}