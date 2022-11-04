const mongoose = require('mongoose')



//mongoose.connect("mongodb://auth_test:CulinaryTh@ec2-54-165-0-20.compute-1.amazonaws.com:27017/recipe_test")

const Schema = mongoose.Schema;
const RecipeSchema = new Schema({
    recipe_id: String,
    image_url: String,
    title: {type:String,required:true},
    description: String,
    tags: {type:[String], required: true, validate: [tagsValid, '{PATH} does not meet requirements.']},
    steps: {
        type: [{
            step_no: Number,
            step: String
    }],
        validate: [stepsValid, '{PATH} does not meet requirements.'],
        required: true
    },
    ingredients: {
        type: [{
            ingre_no: Number,
            ingredient: String,
            quantity: String
        }],
        required: true,
        validate: [ingredsValid, '{PATH} does not meet requirements.']
    },
    dietary_preferences: {type:String, required:true, enum:["vegetarian", "nonvegetarian","contains egg"]},
    prep_time: {type:Number,required:true, enum:[30, 60, 90]},
    cuisine: String,
    isPublic: {type:Boolean,default:true},
    user_id: {type:String, required:true}
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
module.exports = mongoose.model('Recipes', RecipeSchema);