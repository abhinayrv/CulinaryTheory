function subfetch(){

  fetch("http://localhost:9000/api/isemailsub")
  .then(response => response.json())
  .then(function(response){
      console.log(response);
      if(response["data"] == undefined){
        document.getElementById("substatus").innerHTML = "Inactive";
        document.getElementById("bill_month").innerHTML = "-";
    }
      else{
        if(response["data"]["subscribed"]){
        document.getElementById("cancel_sub").innerHTML = "Cancel Email Subscription";
        }
      else{

      }
    }
});
};

var r = response["data"]["active_till"];
      r = new Date(r);
      const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      var res = monthNames[r.getMonth()] + " " + String(r.getFullYear());
      document.getElementById("bill_month").innerHTML = res;





