const mongoose = require("mongoose");
const nanoid = require('nanoid');

const likeSchema={
    like_id:{
        type:String,
        default: ''
    },
    user_id:{
        type:String,
        required:true,
    },
    recipe_id:{
        type:String,
        required:true,
    },
    is_liked:{
        type:Boolean,
        required:true,
    },
    }   

const LikeDislikeModel = mongoose.model("recipiecollections",likeSchema);

module.exports =LikeDislikeModel;