const mongoose = require('mongoose')
const response = require('../helpers/response');
const request = require('../helpers/request');
const nanoid = require('nanoid');


const User = mongoose.model('User');

exports.create = function(req, res, next) {
    if (!req.body.email){

      return response.sendBadRequest(res, "Please check the data entered");

    } 

    User.findOne({ email: req.body.email}).exec(function(err, user){
      if(err) {
        return next(err);
      }

      if(user){

        return response.sendBadRequest(res, "User already exists!");
        
      } 

      req.body.user_id = nanoid();
      const newUser = new User(req.body);
      newUser.role = 'user';
      var err = newUser.validateSync();
      if (err) {
        console.log(err.message);
        return response.sendBadRequest(res, err.message);

      } 

      newUser.save(function(err, user) {
        if (err){
          return next(err);
        }

        var session = req.session;
        user.getSessionData(function(err, session_data){
          if(err){
            return response.sendCreated(res, "Registration successful. User needs to login", user.toJSON());
          }

          session.user = session_data;
          return response.sendCreated(res, "Registration successful", user.toJSON());
        });
      });
    });
    
  }