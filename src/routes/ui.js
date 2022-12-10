const express = require('express');
const response = require('../helpers/response');
const routes  = express.Router();
const auth = require('../controller/auth');
const path = require('path');

routes.use('/home', (req, res) => {
    res.send("The Culinary Theory");
});
routes.get('/auth/reset/:token', auth.validateResetToken, auth.renderResetPage);
routes.get('/login', (req, res) => {
    if (req.session.user) {
        res.send("You are logged in!");
    } else {
        res.sendFile("login.html", {root: path.join(path.dirname(__dirname), "views")});
    }
});

routes.get('/managesubscription', (req, res) => {
    res.sendFile('manage_subscription.html', {root: path.join(path.dirname(__dirname), "views")});
});

routes.get('/subscribe', (req, res) => {
    res.sendFile('subscribe.html', {root: path.join(path.dirname(__dirname), "views")});
});

routes.get('/admindashboard', (req, res) => {
    res.sendFile('admin_dashboard.html', {root: path.join(path.dirname(__dirname), "views")});
});

routes.get('/superadmin', (req, res) => {
    res.sendFile('superAdmin.html', {root: path.join(path.dirname(__dirname), "views")});
});

module.exports = routes;
