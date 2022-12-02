const  mongoose = require("mongoose");
const nanoid = require("nanoid");
const paypal = require("../helpers/paypal-api");
const response = require('../helpers/response');
const config = require("../config/config");

const User = mongoose.model("User");
const Premium = mongoose.model("Premium");

exports.generateSubscription = function(req, res){
    if (!req.body.user_id){
        return response.sendBadRequest(res, "No user id");
    }

    User.findOne({user_id: req.body.user_id}).exec(function(err, user){
        if (err){
            console.log("Error searching for the user");
            throw err
        }

        if(!user){
            console.log("No user found");
            return response.sendBadRequest(res, "No user found");
        }

        Premium.findOne({user_id: req.body.user_id}).exec(function(err, premium_sub){
            if(err){
                console.log("Error searching premium sub");
                throw err;
            }
    
            if (premium_sub){
                if (premium_sub.subscribed){
                    return response.sendBadRequest(res, "Active subscription exists");
                }

                if(premium_sub.active){
                    var new_start = new Date(premium_sub.active_till)
                    new_start = new Date(new_start.getTime() + 1440 * 60000);
                    paypal.create_subscription(config.paypal.non_trial_id, user.email, user.email, new_start, function(err, response_json){
                        if (err){
                            console.log("Error creating subscription");
                            throw err
                        }

                        return response.sendCreated(res, "Subscription created", response_json);
                    });
                } else {
                    paypal.create_subscription(config.paypal.non_trial_id, user.email, user.email, null, function(err, response_json){
                        if (err){
                            console.log("Error creating subscription");
                            throw err
                        }

                        return response.sendCreated(res, "Subscription created", response_json);
                    });
                }
            } else {
                paypal.create_subscription(config.paypal.trial_id, user.email, user.email, null, function(err, response_json){
                    if (err){
                        console.log("Error creating subscription");
                        throw err
                    }

                    return response.sendCreated(res, "Subscription created", response_json);
                });
            }
        })
    }); 
}

exports.cancelSubscription = function(req, res){
    if (!req.body.user_id) {
        return response.sendBadRequest(res, "No user id");
    }

    User.findOne({user_id: req.body.user_id}).exec(function(err, user){
        if(err){
            console.log("Error looking for user");
            throw err;
        }

        if(!user){
            return response.sendBadRequest(res, "User does not exist");
        }

        Premium.findOne({user_id: req.body.user_id, subscribed: true}).exec(function(err, premium){
            if(err){
                console.log("Error looking for subscription");
                throw err;
            }

            if(!premium) {
                return response.sendBadRequest(res, "No active subscription");
            }

            premium.cancelSub(function(err){
                if (err){
                    console.log("Error cancelling subscription");
                    throw err;
                }

                premium.subscribed = false;
                premium.next_billing = undefined;

                premium.save(function(err, premium){
                    if (err){
                        console.log("Error saving cancelled subscription");
                        throw err;
                    }

                    return response.sendSuccess(res, "Cancelled successfully", premium.toJSON());
                });
            });
        });
    });
}


exports.subscribe = function(req, res){
    if(!req.body.user_id || !req.body.paypal_id){
        return response.sendBadRequest(res, "No user id/subscription id");
    }

    User.findOne({user_id: req.body.user_id}).exec(function(err, user){
        if(err){
            console.log("Error looking for user");
            throw err;
        }

        if(!user){
            return response.sendBadRequest(res, "User does not exist");
        }

        req.body.sub_id = nanoid();
        var premium_sub = new Premium(req.body);

        premium_sub.setBillingDate(function(err){
            if (err) {
                console.log("Error setting the next billing date");
                throw err;
            }
            console.log(premium_sub);
            premium_sub.save(function(err, premium_sub){
                if(err){
                    console.log("Error saving subscription details");
                    throw err;
                }

                return response.sendCreated(res, "Subscription successful", premium_sub.toJSON());
            });
        });
    });
}

exports.getSubscription = function(req, res){
    if(!req.body.user_id){
        return response.sendBadRequest(res, "No user id");
    }

    Premium.findOne({user_id: req.body.user_id}).exec(function(err, premium){
        if (err){
            console.log("Error looking for premium sub details");
            throw err;
        }

        if(!premium){
            return response.sendSuccess(res, "No premium subscription");
        }

        if(!premium.active){
            return response.sendSuccess(res, "No active subscription");
        }

        return response.sendSuccess(res, "Success", premium.toJSON());
    })
}

exports.isPremiumUser = function(req, res){
    if(req.session.user){
        if(req.session.user.prem){
            return response.sendSuccess(res, "Success", {status: true});
        } else {
            return response.sendSuccess(res, "Success", {status: false});
        }
    }
    return response.sendBadRequest(res, "Please login and retry");
}
