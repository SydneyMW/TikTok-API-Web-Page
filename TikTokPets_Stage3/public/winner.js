// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

async function sendGetRequest(url) {
  const res = await fetch(url);
  const txt = res.text();
  return txt;
}

sendGetRequest("/getWinner")
.then(function(winner) {
  showWinningVideo(winner);
})
.catch(function(err) {
  console.log("Error",err);
});


// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

function showWinningVideo(object) {
  let parsed = JSON.parse(object);
  console.log("Winner:",parsed);
  let winningUrl = parsed.url;
  let winningId = parsed.rowIdNum;
  let winningName = parsed.nickname;
  console.log("URL:",winningUrl);
  console.log("Id:",winningId);
  console.log("Nickname:",winningName);
  addVideo(winningUrl, divElmt, winningId, winningName);
  loadTheVideos();
}
