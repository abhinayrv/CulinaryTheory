const mongoose = require('mongoose')
const response = require('../helpers/response');
const request = require('../helpers/request');


const User = mongoose.model('User');

exports.create = function(req, res) {
    const newUser = new User({email: req.body.username, password: req.body.password, salt: ''});
    newUser.role = 'user';
    newUser.save(function(err, user) {
      if (err) return response.sendBadRequest(res, err);
      console.log(`Hashed password after save ${user.password}`);
      req.login(user, function(err) {
        if (err) { throw err; }
        response.sendCreated(res, user);
      })
    });
  };