const mongoose = require('mongoose')
const response = require('../helpers/response');
const request = require('../helpers/request');


const User = mongoose.model('User');

exports.create = function(req, res) {
    if (!req.body.username){

      response.sendBadRequest(res, "Please check the data entered");

    } else {

      User.findOne({ email: req.body.username}).exec(function(err, user){
        if(err) {throw err};
        if(user){

          response.sendBadRequest(res, "User already exists!");
          
        } else {

          const newUser = new User({email: req.body.username, password: req.body.password, salt: ''});
          newUser.role = 'user';
          var err = newUser.validateSync();
          if (err) {

            response.sendBadRequest(res, "Please check the data entered");

          } else {

            newUser.save(function(err, user) {
              if (err) return response.sendBadRequest(res, err);
              console.log(`Hashed password after save ${user.password}`);
              req.login(user, function(err) {
                if (err) { throw err; }
                response.sendCreated(res, user);
              })
            });

          }

        }
      });

    }
    
  };