const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const response = require('../helpers/response');
const auth = require('../controller/auth');
const users = require('../controller/users');
const UserInteraction =require ("../controller/UserInteraction")


const routes  = express.Router();

routes.use(response.setHeadersForCORS);

routes.get('/index', auth.ensureAuthenticated, (req, res) => {
    res.send("You have access!");
})

routes.get('/', (req, res) => {

    res.status(200).json({ message: 'Ok' });
});

routes.get('/login/ui', (req, res) => {
    if (req.session.user) {
        res.send("You are logged in!");
    } else {
        res.sendFile("index.html", {root: path.join(path.dirname(__dirname), "views")})
        // res.render("index.html");
    }
  });

routes.post('/login', auth.authenticate)

routes.post('/register', users.create);

routes.post('/add_bookmark',UserInteraction.add_bookmark);
routes.get('/bookmarks/:user_id',UserInteraction.getbookmarks)
routes.delete('/bookmarks/:bookmark_id',UserInteraction.deletebookmark);
routes.post('/post',UserInteraction.insertLikeDislike);
routes.get('/fetch/:Recipe_Id' , UserInteraction.functtest);
routes.get('/fetchcount/:Recipe_Id/:Is_Liked/:Is_Disliked',  UserInteraction.countLikeDislike);
routes.delete('/removelikedislike/:User_Id/:Recipe_Id', UserInteraction.deleteLikedislike);

routes.use(function(req, res) {
  response.sendNotFound(res);
});

//user interaction routes are added here 


module.exports = routes;
