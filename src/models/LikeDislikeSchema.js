const mongoose = require("mongoose");

const LidiSchema={
    Like_Id:String,
    User_Id:String,
    Recipe_Id:String,
    Is_Liked:Boolean,
    Is_Disliked:Boolean
    }   

const LikeDislikeModel = mongoose.model("recipiecollections",LidiSchema);

module.exports =LikeDislikeModel;