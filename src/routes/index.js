const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const response = require('../helpers/response');
const auth = require('../controller/auth');
const users = require('../controller/users');
const recipe = require('../controller/recipe')


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

routes.post('/create',recipe.create);
routes.post('/edit',recipe.edit);

routes.use(function(req, res) {
  response.sendNotFound(res);
});

module.exports = routes;
