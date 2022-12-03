const mongoose = require('mongoose')
const nanoid = require('nanoid');
const response = require('../helpers/response');
const request = require('../helpers/request');


const RecipeModel = mongoose.model('Recipes');

function callback(res, err, docs, message){
    if(err){
        console.log("There is some error.");
        throw err;
    }
    else if (!docs && typeof(docs) !== "undefined"){
        console.log("Docs not found.")
        return response.sendBadRequest(res, message);

    }
    else{
        return response.sendSuccess(res, message, docs);
    }

}

exports.create = function(req, res){
    console.log("In recipe create");

    validateRequest(req.body, function(result){

        if(!result){
            return response.sendBadRequest(res, "One of the fields is missing.")
        }
        else{
            req.body.recipe_id = nanoid();
            const newRecipe = new RecipeModel(req.body);
            const err = newRecipe.validateSync();
            if (err){
                return response.sendBadRequest(res, err.errors, err);
            }
            newRecipe.save(function(err, recipe){
                if (err) return response.sendBadRequest(res, err);
                response.sendCreated(res, "Successfully created the recipe", newRecipe.toJSON());
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

        if (recipe.user_id != req.body.user_id) {
            return response.sendForbidden(res);
        }
        
        validateRequest(req.body, function(result){
            if(!result){
                console.log("In if")
                return response.sendBadRequest(res, "One of the fields is wrong/missing.")
            }
            else{
                recipe.updateDoc(req.body);
                recipe.save(function(err, recipe){
                if (err) return response.sendBadRequest(res, "Please check the data entered.", err);
                response.sendSuccess(res, "Successfully updated the doc.", recipe.toJSON());
            });
        }
    });
});
}

exports.delete = function(req, res){

    if(!req.body.user_id || !req.body.recipe_id){
        console.log("No user id or recipe id present.");
        response.sendBadRequest(res, "No user id or recipe id present.")
    }
    else{
        if (req.session.user.role == "admin"){
            console.log("Admin will delete the recipe.")
            RecipeModel.updateOne({recipe_id : req.body.recipe_id},{$set : {adminDelete : true} }, function(err, doc){
                var sucMessage = 'Successfully deleted the document by admin.';
                return callback(res, err, doc, sucMessage);
            });
        }
        else{
            console.log("Deleting recipe by particular user.")
            RecipeModel.deleteOne({user_id : req.body.user_id, recipe_id : req.body.recipe_id}, function(err){
                var sucMessage = 'Successfully deleted the document by user.';
                return callback(res, err, undefined, sucMessage);
            });

        }

    }

}

function validateRequest(reqBody, next){
    if(!reqBody.image_url || !reqBody.title || !reqBody.description || !reqBody.tags || !reqBody.steps || 
        !reqBody.ingredients || !reqBody.dietary_preferences || !reqBody.prep_time || !reqBody.cuisine
        ){
            return next(false);
        }
        return next(true);
}


