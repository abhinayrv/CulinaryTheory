const mongoose = require('mongoose')
const response = require('../helpers/response');
const request = require('../helpers/request');


const User = mongoose.model('User');

exports.create = function(req, res) {
    if (!req.body.username){

      return response.sendBadRequest(res, "Please check the data entered");

    } 

    User.findOne({ email: req.body.username}).exec(function(err, user){
      if(err) {
        throw err;
      }

      if(user){

        return response.sendBadRequest(res, "User already exists!");
        
      } 

      const newUser = new User({email: req.body.username, password: req.body.password});
      newUser.role = 'user';
      var err = newUser.validateSync();
      if (err) {

        return response.sendBadRequest(res, "Please check the data entered");

      } 

      newUser.save(function(err, user) {
        if (err){
          throw err;
        }

        var session = req.session;
        session.user = user.getSessionData();
        return response.sendCreated(res, user);

      });
    });
    
  }