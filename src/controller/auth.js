const mongoose = require('mongoose');
const config = require('../config/config');
const response = require('../helpers/response');
const User = mongoose.model('User');

exports.authenticate = function(req, res) {
    console.log(`Login request`);
  
  if (!req.body.username || !req.body.password) {

    return response.sendBadRequest(res, "Please check the fields enetered");
    
  } 

  User.findOne({ email: req.body.username })
  .exec(function(err, user) {
    if (err) {
        console.log("Some error in user find");
        throw err;
    }

    if (!user) {
        
      console.log("User not found");
        return response.sendUnauthorized(res, "Incorrect username or password");

    } else  {

      user.verifyPassword(req.body.password, function(err, isMatch) {

        if (err) { 
            console.log("Some error in password compare");
            throw err
        }

        if (isMatch) {
            var session = req.session;
            session.user = user.getSessionData();
            return response.sendSuccess(res, "Logged in successfully!");
        }
        
        console.log("Password did not match");
        return response.sendUnauthorized(res, "Incorrect username or password")
        
      });

    }
  });

  
  
}

exports.signOut = function(req, res) {
  req.session.destroy(function(err){
    
    if(err){
      throw err;
    }

    return response.sendSuccess(res, "Logged out.")

  });
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.session.user) {
      return next();
    }
    return response.sendUnauthorized(res, "Please login and retry");
  };

