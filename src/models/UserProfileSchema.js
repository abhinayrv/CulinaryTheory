const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    user_name:{
        type:String,
        required:true,
    },
    bio_info:{
        type:String,
        required:true,
    },
});

UserProfileSchema.set('toJSON', {
    transform: function(doc, ret, options) {
      delete ret._id;
      return ret;
    }
  });


module.exports = mongoose.model('UserProfile', UserProfileSchema);