import React, {useEffect} from 'react';

const useSendPost = function(url, date_given, options, thenFun, catchFun) {
  async function sendPostDate() {
    let params = {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(date_given)};
    //console.log("Sending post request with body",params.body);
    let response = await fetch(url, params);
    if (response.ok) {
      let text = await response.text();  // promise from server, result = "Got it"
      let parsed = await JSON.parse(text);
      //console.log("Server response has ", parsed.length," objects");
      thenFun(parsed);
    } else {
      throw Error(response.status);
    }
  }

  useEffect(function () {
    //console.log("Calling send post");
    sendPostDate();
  }, [options]);
}



export default useSendPost;