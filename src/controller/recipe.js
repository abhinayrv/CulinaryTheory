const mongoose = require('mongoose')
const nanoid = require('shortid');
const response = require('../helpers/response');
const request = require('../helpers/request');


const RecipeModel = mongoose.model('Recipes');

exports.create = function(req, res){
    console.log("In recipe create");
    console.log(req.body);

    validateRequest(req.body, function(result){

        if(!result){
            return response.sendBadRequest(res, "One of the fields is missing.")
        }
        else{
            req.body.recipe_id = nanoid.generate();
            const newRecipe = new RecipeModel(req.body);
            const err = newRecipe.validateSync();
            if (err){
                return response.sendBadRequest(res, "Please check the data entered.");
            }
            newRecipe.save(function(err, recipe){
                if (err) return response.sendBadRequest(res, err);
                response.sendCreated(res, "Successfully created in the database.");
            });
        }
    });

}

exports.edit = function(req, res){
    console.log("In edit recipe.")
    if(!req.body.recipe_id){
        return response.sendBadRequest(res, "Recipe Id not in request.")
    }

    RecipeModel.findOne({recipe_id:req.body.recipe_id}).exec(function (err, recipe){
        if (err){
            console.log("There is some error in find one.");
            throw err;
        }
        if (!recipe){
            console.log("Doc not found.")
            return response.sendBadRequest(res, "No document found for the given id.");
        }
        
        validateRequest(req.body, function(result){
            if(!result){
                console.log("In if")
                return response.sendBadRequest(res, "One of the fields is wrong.")
            }
            else{
                recipe.updateDoc(req.body);
                recipe.save(function(err, recipe){
                if (err) return response.sendBadRequest(res, err);
                response.sendSuccess(res, "Successfully updated the doc.");
            });
        }
    });
});
    
}
function validateRequest(reqBody, next){
    if(!reqBody.image_url || !reqBody.title || !reqBody.description || !reqBody.tags || !reqBody.steps || 
        !reqBody.ingredients || !reqBody.dietary_preferences || !reqBody.prep_time || !reqBody.cuisine
        ){
            return next(false);
        }
        return next(true);
}