const mongoose = require('mongoose');
const nanoid = require('nanoid');

const Schema = mongoose.Schema;
const DraftSchema = new Schema({
    recipe_id: {
        type: String,
        required: true
    },
    image_url: String,
    title: {type:String,required:true},
    description: String,
    tags: {type:[String], validate: [tagsValid, '{PATH} does not meet requirements.']},
    steps: {
        type: [{
            step_no: {type:Number},
            step: {type:String}
    }],
        validate: [stepsValid, '{PATH} does not meet requirements.'],
    },
    ingredients: {
        type: [{
            ingre_no: {type:Number},
            ingredient: {type:String},
            quantity: {type:String},
        }],
        validate: [ingredsValid, '{PATH} does not meet requirements.']
    },
    dietary_preferences: {type:String},
    prep_time: {type:Number},
    cuisine: String,
    is_public: {type:Boolean,default:true},
    user_id: {type:String, required:true}
},
    {timestamps: true}
);
function tagsValid(arr){
    flag = true;
    for(i in arr){
        flag = arr[i].length <= 10
        if(flag==false){
            break;
        }
    }
    return flag;
}

function stepsValid(arr){
    flag = true;
    for(i in arr){
        if(arr[i].step_no) {
            flag = arr[i].step !== undefined;
            if(flag==false){
                return false;
            }
        }
    }
    return true;
}

function ingredsValid(arr){
    flag = true;
    for(i in arr){
        flag = arr[i].ingredient.length <= 30
        if(flag==false){
            return false;
        }
    }
    return true;
}
DraftSchema.methods.updateDoc = function(newData){
    this.image_url = newData.image_url;
    this.title = newData.title;
    this.description = newData.description;
    this.tags = newData.tags;
    this.steps = newData.steps;
    this.ingredients = newData.ingredients;
    this.dietary_preferences = newData.dietary_preferences;
    this.prep_time = newData.prep_time;
    this.cuisine = newData.cuisine;
    this.is_public = newData.isPublic;
}

DraftSchema.set('toJSON', {
    transform: function(doc, ret, options) {
      delete ret._id;
      return ret;
    }
  });

module.exports = mongoose.model('Drafts', DraftSchema);