const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    user_id:String,
    bookmarkURL:String,
    bookmark_id:Number,
});


module.exports = mongoose.model('Bookmarks', BookmarkSchema);


