const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    report_id:{
        type:String,
        required:true,
    },
    recipe_id:{
        type:String,
        required:true,
    },
    reason:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    action_by:{
        type:String,
        required:true,
    },
    },
    {timestamps: true}
);

ReportSchema.set('toJSON', {
    transform: function(doc, ret, options) {
      delete ret._id;
      return ret;
    }
  });


module.exports = mongoose.model('Report',ReportSchema);

