const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const response = require('../helpers/response');
const auth = require('../controller/auth');
const users = require('../controller/users');
const recipe = require('../controller/recipe')
const UserInteraction =require ("../controller/UserInteraction")
const subscription = require("../controller/subscription");


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
    }
  });

routes.post('/login', auth.authenticate)


routes.post('/register', users.create);
routes.get('/logout', auth.signOut);
routes.post('/reset', auth.resetPasswordEmail);
routes.get('/reset/:token', auth.validateResetToken, auth.renderResetPage);
routes.post('/resetpassword', auth.validateResetToken, auth.resetPassword, auth.deleteToken);
routes.post('/updatepassword', auth.ensureAuthenticated, auth.ensureOwner, auth.updatePassword);

routes.post('/gensub', auth.ensureAuthenticated, auth.ensureOwner, subscription.generateSubscription);
routes.post('/subscribe', auth.ensureAuthenticated, auth.ensureOwner, subscription.subscribe);
routes.post('/cancelsub', auth.ensureAuthenticated, auth.ensureOwner, subscription.cancelSubscription);
routes.post('/getsub', auth.ensureAuthenticated, auth.ensureOwner, subscription.getSubscription);
routes.get('/ispremium', subscription.isPremiumUser);

routes.post('/subscribemail', auth.ensureAuthenticated, subscription.subscribeEmail);
routes.get('/isemailsub', auth.ensureAuthenticated, subscription.isEmailSub);
routes.post('/unsubemail', auth.ensureAuthenticated, subscription.unsubEmail);

routes.post('/bookmark', auth.ensureAuthenticated, auth.ensureOwner, UserInteraction.add_bookmark);
routes.get('/bookmarks/:user_id', auth.ensureAuthenticated, auth.ensureOwner, UserInteraction.getbookmarks)
routes.delete('/deletebookmark', auth.ensureAuthenticated, auth.ensureOwner, UserInteraction.deletebookmark);
routes.post('/like', auth.ensureAuthenticated, auth.ensureOwner, UserInteraction.insertLikeDislike);
routes.get('/likes/:recipe_id', UserInteraction.countLikeDislike);
routes.delete('/deletelike', auth.ensureAuthenticated, auth.ensureOwner, UserInteraction.deleteLikedislike);
routes.post('/comment',auth.ensureAuthenticated, UserInteraction.addComment);
routes.get('/comments/:recipe_id',auth.ensureAuthenticated, UserInteraction.getcomments)
routes.post('/report',auth.ensureAuthenticated,UserInteraction.add_reported_recipe);
routes.get('/reports',auth.ensureAuthenticated, UserInteraction.getReports);
routes.post('/report/close',auth.ensureAuthenticated, UserInteraction.closeReport);
routes.post('profile/create', auth.ensureAuthenticated, UserInteraction.createUserProfile);
routes.post('profile/edit', auth.ensureAuthenticated, UserInteraction.editUserProfile);
routes.get('/myprofile', auth.ensureAuthenticated, UserInteraction.getMyUserProfile);
routes.get('/profile/:query_user_id', auth.ensureAuthenticated, UserInteraction.getUserProfile);
routes.get('/isbookmarked', auth.ensureAuthenticated, UserInteraction.isBookmarked);
routes.get('/isliked', auth.ensureAuthenticated, UserInteraction.isLiked);

routes.post('/create', auth.ensureAuthenticated, auth.ensureOwner, recipe.create);
routes.post('/edit', auth.ensureAuthenticated, auth.ensureOwner, recipe.edit);

routes.use(function(req, res) {
  response.sendNotFound(res);
});


module.exports = routes;
