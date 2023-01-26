'use strict';
const submitButton = document.getElementById("continue");
submitButton.addEventListener("click",buttonAction);

async function sendPostRequest(url,data) { // ADDED FROM BROWSER REDIRECT EXAMPLE
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function buttonAction() {
  let username = document.getElementById("username").value;
  let url = document.getElementById("url").value;
  let nickname = document.getElementById("nickname").value;
  console.log("We got",username,url,nickname);
  
  sendPostRequest('/videoData',nickname)  // only sending nickname for now
    .then(function(data) {
      sessionStorage.setItem("nickname",nickname);
      window.location = "/submitted.html";  })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}


