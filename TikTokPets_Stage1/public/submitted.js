// To let the acknowlegement page know what the nickname is, store it using the browser's built-in variable sessionStorage function.
const report = document.getElementById("pinkText");  // report points to pinkText
let oldNickname = sessionStorage.getItem("nickname");  // remember nickname

let msg = report.textContent;  // Message = 'placeholder'
msg = msg.replace("placeholder", oldNickname);  // replace placeholder with Bob the supercat
report.textContent = msg;  // pinkText stores Bob the supercat

const submitButton2 = document.getElementById("continue2");
submitButton2.addEventListener("click",buttonAction2);

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


function buttonAction2() { 
  
  // console.log("sending",username, url, nickname);
  sendPostRequest('/videoData',oldNickname)
    .then(function(data) {
      // sessionStorage.setItem("pick",data);
      window.location = "/tiktokpets.html";  })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}