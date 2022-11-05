const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    bookmark_id:{
        type:String,
        // required:true,
        default: ""
    },
    recipe_id:{
        type:String,
        required:true,
    },
});


module.exports = mongoose.model('Bookmarks', BookmarkSchema);


