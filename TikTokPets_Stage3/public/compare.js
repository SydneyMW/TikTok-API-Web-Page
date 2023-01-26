let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
  heartButtons[i].addEventListener("click", function() { preferVideo(i); });
} // for loop

let nextButton = document.getElementsByClassName("enabledButton")[0];
nextButton.addEventListener("click",sendPreference);

function preferVideo(left_right) {
  if (left_right == 0) {console.log("left preferred")};
  if (left_right == 1) {console.log("right preferred")};
  // 0 -> left preferred
  // 1 -> right preferred
  other_video = 1 - left_right;  
  // gives 0 -> when right preferred
  // gives 1 -> when left preferred
  let heartButtons = document.querySelectorAll("div.heart");
  heartButtons[left_right].classList.remove("unloved");
  heartButtons[left_right].classList.add("loved");
  heartButtons[other_video].classList.add("unloved");
  heartButtons[other_video].classList.remove("loved");
  // make liked video heart solid
  // make unliked video heart empty
  heartButtons[left_right].firstElementChild.classList.remove("far");
  heartButtons[left_right].firstElementChild.classList.add("fas");
  heartButtons[other_video].firstElementChild.classList.remove("fas");
  heartButtons[other_video].firstElementChild.classList.add("far");
  
  // label videos as preferred or not
  let videoElements = document.getElementsByClassName("tiktok-embed");
  videoElements[left_right].setAttribute("preferred", 1);
  videoElements[other_video].setAttribute("preferred", 0);
}

function sendPreference() {
  // collect loved and unloved videos at time of button press
  console.log("...Beginning Send Preference");
  let videoElements = document.getElementsByClassName("tiktok-embed");
  
  let leftPreferred = videoElements[0].getAttribute("preferred");
  let rightPreferred = videoElements[1].getAttribute("preferred");
  
  let leftID = videoElements[0].getAttribute("rowIdNum");
  let rightID = videoElements[1].getAttribute("rowIdNum");
  
  let better_id;
  let worse_id;
  if (leftPreferred == 1) {
    better_id = leftID;
    worse_id = rightID;
  } else if (rightPreferred == 1) {
    better_id = rightID;
    worse_id = leftID;
  } else {
    console.log("You screwed up!");
  }
  console.log("Better video id: ", better_id);
  console.log("Worse video id: ", worse_id);

  sendPostRequest("/insertPref", better_id, worse_id)
  .then(function(response){
    console.log(response); // "Continue" or "pick winner"
    if (response == "Pick winner") {
      window.location = "winner.html";
    } else {
      location.reload();
    }
  })
  .catch(function(err) {
    console.log("Error: ",err);
  });
}

async function sendPostRequest(url, better, worse) {
  let data = {};
  data.better = better;
  data.worse = worse;
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function sendGetRequest(url) {
  const res = await fetch(url);
  const txt = res.text();
  return txt;
}

sendGetRequest("/getTwoVideos") 
.then(function(videoData) {
  provideVideoData(videoData);
})
.catch(function(err) {
  console.log("Error:",err);
});


async function provideVideoData(videoData) {
  // Grab URLs, IDs from GET object
  //console.log(videoData);
  //console.log(JSON.parse(videoData));
  let parsed = JSON.parse(videoData);
  let urls = [parsed[0].url, parsed[1].url];
  let ids = [parsed[0].rowIdNum, parsed[1].rowIdNum];
  let nicknames = [parsed[0].nickname, parsed[1].nickname];
  console.log("...Urls found: ", urls);
  console.log("...Ids found: ",ids);
  // Feed URLs into DOM
  for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i], ids[i], nicknames[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
}


    