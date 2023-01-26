let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

// given function that sends a post request
async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}


function buttonPress() { 
    // Get all the user info.
  let username = document.getElementById("user").value;
  let URL = document.getElementById("URL").value;
  let nickname = document.getElementById("nickname").value;

  let data = username+","+URL+","+nickname;
    
  sendPostRequest("/videoData", data)
  .then( function (response) {
    console.log("Response recieved", response);
    sessionStorage.setItem("nickname", nickname);
    window.location = "redirect.html";
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
}
