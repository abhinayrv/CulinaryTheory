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

routes.post('/api/bookmark',UserInteraction.add_bookmark);
routes.get('/api/bookmarks/:user_id',UserInteraction.getbookmarks)
routes.delete('/api/deletebookmark',UserInteraction.deletebookmark);
routes.post('/api/like',UserInteraction.insertLikeDislike);
routes.get('/api/likes/:recipe_id',  UserInteraction.countLikeDislike);
routes.delete('/api/deletelike', UserInteraction.deleteLikedislike);

routes.use(function(req, res) {
  response.sendNotFound(res);
});

//user interaction routes are added here 


module.exports = routes;
