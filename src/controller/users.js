const mongoose = require('mongoose')
const response = require('../helpers/response');
const request = require('../helpers/request');
const nanoid = require('nanoid');


const User = mongoose.model('User');

exports.create = function(req, res) {
    if (!req.body.email){

      return response.sendBadRequest(res, "Please check the data entered");

    } 

    User.findOne({ email: req.body.email}).exec(function(err, user){
      if(err) {
        throw err;
      }

      if(user){

        return response.sendBadRequest(res, "User already exists!");
        
      } 

      req.body.user_id = nanoid();
      const newUser = new User(req.body);
      newUser.role = 'user';
      var err = newUser.validateSync();
      if (err) {
        console.log(err);
        return response.sendBadRequest(res, "Please check the data entered");

      } 

      newUser.save(function(err, user) {
        if (err){
          throw err;
        }

        var session = req.session;
        session.user = user.getSessionData();
        return response.sendCreated(res, "Registration successful", user.toJSON());

      });
    });
    
  }