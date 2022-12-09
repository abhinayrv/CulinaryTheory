paypal.Buttons({
    createSubscription: function (data, actions) {
        return fetch("/api/gensub", {
          method: "post",
        })
          .then((response) => {
            if (!response.ok) {
                return response.json().then(rjson => {throw Error(rjson.message);});
            }
            return response.json();
          })
          .then((rjson) => rjson.data.id)
          .catch((err)=> {
            document.getElementById("emptyHeader").innerHTML = err.message;
            document.getElementById("emptyCard").style.display = "block";
          });
        },

        onApprove: function (data, actions) {
            console.log(data);
            var request_data = {
                paypal_id: data.subscriptionID
            }
            return fetch("/api/subscribe", {
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(request_data),
                method: "post",
              })
                .then((response) => {
                  if (!response.ok) {
                      return response.json().then(rjson => {throw Error(rjson.message);});
                  }
                  return response.json();
                })
                .then((rjson) => {
                    document.getElementById("emptyHeader").innerHTML = "Subscribed Sucessfully!";
                    document.getElementById("emptyCard").style.display = "block";
                    setTimeout(()=>{
                        window.location.href = "/api/myprofile"
                    }, 2000)
                })
                .catch((err)=> {
                  document.getElementById("emptyHeader").innerHTML = err.message;
                  document.getElementById("emptyCard").style.display = "block";
                });
          },
}).render("#paypal-button-container");