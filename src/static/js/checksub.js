async function logincheck(){
  var response = await fetch("/api/myprofile");
  var rjson = await response.json();

  if(response.ok){
    subfetch();
    document.getElementById("user-name").innerText = rjson.data.user_name;
    document.getElementById("profile-image").src = rjson.data.profile_image;
    return false;
  } else {
    var emptyHeader = document.getElementById("emptyHeader");
    emptyHeader.innerText = String(rjson.message);
    document.getElementById("emptyCard").style = "display:block";
    document.getElementById("subscription-section").style.display = "none";
    setTimeout(()=>{
      window.location.href = "/";
    }, 3000);
    return false;
  }
}

async function subfetch(){

//   fetch("/api/isemailsub")
//   .then((response) => {
//     if(!response.ok){
//       return response.json().then(rjson => {throw Error(rjson.message)});
//     }
//     return response.json();
//   }).then(function(response){
//     console.log(response);
//     if(response["data"]["subscribed"]){
//       document.getElementById("email_sub").innerHTML = "Cancel Newsletter Subscription";
//       document.getElementById("email_sub").onclick = unsubEmail;
//     }
//     else{
//       document.getElementById("email_sub").innerHTML = "Subscribe to newsletter"
//       document.getElementById("email_sub").onclick = subEmail;
//     }

// }).catch((err) =>{
//   console.log(err);
// });

  var response = await fetch("/api/getSub");
  var rjson = await response.json();

  if(!response.ok){
    console.log(rjson.message);
    var emptyHeader = document.getElementById("emptyHeader");
    emptyHeader.innerText = String(rjson.message);
    document.getElementById("emptyCard").style = "display:block";
    console.log("returning from here 2")
  } else {
    
      if(rjson.data.next_billing){
        var r = new Date(response["data"]["active_till"]).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});
        document.getElementById("bill_month").innerHTML = r;
        document.getElementById("substatus").innerHTML = "Subscribed";

      } else {
        document.getElementById("bill_month").innerHTML = "";
      }

      if(rjson.data.active){
        await checkemailSub();
        document.getElementById("substatus").innerHTML = "Active";
      } else {
        document.getElementById("email_sub").style.display = "none";
        document.getElementById("substatus").innerHTML = "Inactive";
      }

      if (rjson.data.subscribed){
        document.getElementById("cancel_sub").innerHTML = "Cancel Subscription";
        document.getElementById("cancel_sub").onclick = cancelSub;
      } else {
        document.getElementById("cancel_sub").innerHTML = "Subscribe";
        document.getElementById("cancel_sub").onclick = redirecttosub;
      }

  }

};

async function checkemailSub(){
  var response = await fetch("/api/isemailsub");
  var rjson = await response.json();
  if (!response.ok){
    console.log(rjson.message);
    var emptyHeader = document.getElementById("emptyHeader");
    emptyHeader.innerText = String(rjson.message);
    document.getElementById("emptyCard").style = "display:block";
    console.log("returning from here 2")
    return false
  }
  else {

    if(rjson["data"]["subscribed"]){
      document.getElementById("email_sub").innerHTML = "Cancel Newsletter Subscription";
      document.getElementById("email_sub").onclick = unsubEmail;
    }
    else{
      document.getElementById("email_sub").innerHTML = "Subscribe to newsletter"
      document.getElementById("email_sub").onclick = subEmail;
    }
    return true;
  }

}

async function cancelSub(){
  var requestOptions = {
  method: 'POST',
  redirect: 'follow'
};

var response = await fetch("/api/cancelsub", requestOptions)
var rjson = await response.json(); 
  if(!response.ok){
    console.log(rjson.message);
    var emptyHeader = document.getElementById("emptyHeader");
    emptyHeader.innerText = String(rjson.message);
    document.getElementById("emptyCard").style = "display:block";
    console.log("returning from here 2")
      return true;
  } else {
      console.log("Subscription cancelled successfully!")
      location.reload();
  }
}

async function subEmail(){

  var requestOptions = {
  method: 'POST',
  redirect: 'follow'
  };

  var response = await fetch("/api/subscribemail", requestOptions);
  var rjson = await response.json(); 
  if(!response.ok){
    console.log(rjson.message);
    var emptyHeader = document.getElementById("emptyHeader");
    emptyHeader.innerText = String(rjson.message);
    document.getElementById("emptyCard").style = "display:block";
    console.log("returning from here 2")
      return true;
  } else {
      console.log("Subscribed to Newsletter successfully!")
      location.reload();
  }
}

async function unsubEmail(){
  var requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };
    
  var response  = await fetch("/api/unsubemail", requestOptions);
  var rjson = await response.json(); 
  if(!response.ok){
    console.log(rjson.message);
    var emptyHeader = document.getElementById("emptyHeader");
    emptyHeader.innerText = String(rjson.message);
    document.getElementById("emptyCard").style = "display:block";
    console.log("returning from here 2")
      return true;
  } else {
      console.log("Unsubscribed from Newsletters Successfully!");
      location.reload();
  }
}

function redirecttosub()
{
  console.log("cancelled");
  window.location.href='/subscribe';
  return false;
}






