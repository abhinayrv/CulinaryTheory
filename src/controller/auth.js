const mongoose = require('mongoose');
const config = require('../config/config');
const response = require('../helpers/response');
const User = mongoose.model('User');

exports.authenticate = function(req, res) {
    console.log(`Login request`);
  
  if (!req.body.username || !req.body.password) {

    response.sendBadRequest(res, "Please check the fields enetered");
    
  } else {

    User.findOne({ email: req.body.username })
    .exec(function(err, user) {
      if (err) {
          console.log("Some error in user find");
          throw err;
      }

      if (!user) {
          console.log("User not found");
          response.sendUnauthorized(res, "Incorrect username or password")
      } else if (user) {
        user.verifyPassword(req.body.password, function(err, isMatch) {
          if (err) { 
              console.log("Some error in password compare");
              throw err
          }
          if (isMatch) {
              var session = req.session;
              session.user = {username: user.email, role:user.role};
              response.sendSuccess(res, "Logged in successfully!");
          } else {
              console.log("Password did not match");
              response.sendUnauthorized(res, "Incorrect username or password")
          }
        });
      }
    });

  }
  
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.session.user) {
      return next();
    }
    response.sendUnauthorized(res, "Please login and retry");
  };

