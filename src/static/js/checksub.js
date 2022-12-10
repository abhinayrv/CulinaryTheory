function subfetch(){

  fetch("/api/isemailsub")
  .then((response) => {
    if(!response.ok){
      return response.json().then(rjson => {throw Error(rjson.message)});
    }
    return response.json();
  }).then(function(response){
    console.log(response);
    if(response["data"]["subscribed"]){
      document.getElementById("email_sub").innerHTML = "Cancel Newsletter Subscription";
      document.getElementById("email_sub").onclick = unsubEmail;
    }
    else{
      document.getElementById("email_sub").innerHTML = "Subscribe to newsletter"
      document.getElementById("email_sub").onclick = subEmail;
    }

}).catch((err) =>{
  console.log(err);
});

fetch("/api/getSub")
  .then((response) => {
    if(!response.ok){
      return response.json().then(rjson => {throw Error(rjson.message)});
    }
    return response.json();
  }).then(function(response){
    console.log(response);
    if(response.data.next_billing){

      var r = new Date(response["data"]["active_till"]).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});
      document.getElementById("bill_month").innerHTML = r;
      document.getElementById("substatus").innerHTML = "Subscribed";

    } else {
      document.getElementById("bill_month").innerHTML = "";
    }

    if(response.data.active){
      document.getElementById("substatus").innerHTML = "Active";
    } else {
      document.getElementById("substatus").innerHTML = "Inactive";
    }

    if (response.data.subscribed){
      document.getElementById("cancel_sub").innerHTML = "Cancel Subscription";
      document.getElementById("cancel_sub").onclick = cancelSub;
    } else {
      document.getElementById("cancel_sub").innerHTML = "Subscribe";
      document.getElementById("cancel_sub").onclick = redirecttosub;
    }

}).catch((err) =>{
  console.log(err);
});


};

async function cancelSub(){
  var requestOptions = {
  method: 'POST',
  redirect: 'follow'
};

var response = await fetch("/api/cancelsub", requestOptions)
var rjson = await response.json(); 
  if(!response.ok){
      console.log("Error cancelling subscription");
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
      console.log("Error subscribing to Newsletter!");
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
      console.log("Error unsubscribing from Newsletter");
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






