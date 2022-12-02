const mongoose = require('mongoose');
const nanoid = require('nanoid');

const Schema = mongoose.Schema;
const RecipeSchema = new Schema({
    recipe_id: {
        type: String,
        required: true,
        default: nanoid()
    },
    image_url: String,
    title: {type:String,required:true},
    description: String,
    tags: {type:[String], required: true, validate: [tagsValid, '{PATH} does not meet requirements.']},
    steps: {
        type: [{
            step_no: {type:Number,required:true},
            step: {type:String,required:true}
    }],
        validate: [stepsValid, '{PATH} does not meet requirements.'],
        required: true
    },
    ingredients: {
        type: [{
            ingre_no: {type:Number,required:true},
            ingredient: {type:String,required:true},
            quantity: {type:String,required:true},
        }],
        required: true,
        validate: [ingredsValid, '{PATH} does not meet requirements.']
    },
    dietary_preferences: {type:String, required:true, enum:["vegetarian", "nonvegetarian","contains egg"]},
    prep_time: {type:Number,required:true, enum:[30, 60, 90]},
    cuisine: String,
    is_public: {type:Boolean,default:true},
    user_id: {type:String, required:true},
    adminDelete : {type: Boolean, default : false}
},
    {timestamps: true}
);
function tagsValid(arr){
    return arr.length >= 5 && arr.length <= 10;
}

function stepsValid(arr){
    return arr.length >= 5;
}

function ingredsValid(arr){
    return arr.length >= 3 && arr.length <= 20;
}
RecipeSchema.methods.updateDoc = function(newData){
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

RecipeSchema.set('toJSON', {
    transform: function(doc, ret, options) {
      delete ret._id;
      return ret;
    }
  });

module.exports = mongoose.model('Recipes', RecipeSchema);