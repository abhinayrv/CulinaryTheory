const mongoose = require('mongoose')
const nanoid = require('nanoid');
const response = require('../helpers/response');
const request = require('../helpers/request');
const recipe = require('../models/recipe');


const RecipeModel = mongoose.model('Recipes');

exports.create = function(req, res){
    console.log("In recipe create");
    console.log(req);

    validateRequest(req.body, function(result){

        if(!result){
            return response.sendBadRequest(res, "One of the fields is missing.")
        }
        else{
            req.body.recipe_id = nanoid();
            const newRecipe = new RecipeModel(req.body);
            const err = newRecipe.validateSync();
            if (err){
                console.log(err);
                return response.sendBadRequest(res, "Please check the data entered.", err);
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
function validateRequest(reqBody, next){
    if(!reqBody.image_url || !reqBody.title || !reqBody.description || !reqBody.tags || !reqBody.steps || 
        !reqBody.ingredients || !reqBody.dietary_preferences || !reqBody.prep_time || !reqBody.cuisine
        ){
            return next(false);
        }
        return next(true);
}

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

exports.search = function(req, res){
    console.log("In recipe search");

    if (!req.params.searchBy){
        console.log("No search by field found.");
        return response.sendBadRequest(res, "Search By field not present.");
    }
    if (!req.params.searchFor){
        console.log("No search for field found.");
        return response.sendBadRequest(res, "Search For field not present.");
    }


    var searchBy = req.params.searchBy.toLowerCase();
    var searchFor = req.params.searchFor;

    var limit = parseInt(req.params.limit)
    var pageNumber = parseInt(req.params.pageNumber)


    console.log(searchBy);
    console.log(searchFor);

    if(searchBy == "title"){
        RecipeModel.find({title : {$regex : searchFor, $options: 'i'}, isPublic: true}, function(err1, docs){
            RecipeModel.countDocuments({title : {$regex : searchFor, $options: 'i'}, isPublic: true}, function(err2, count){
                if(err1){
                    throw err1;
                }
                else if(err2){
                    throw err2;
                }
                else if(typeof(docs) == "undefined" || !docs){
                    return res.sendBadRequest(res, "No docs found.");
                }
                else{
                    var data = {}
                    data['total_count'] = count;
                    data['pages'] = Math.ceil(count / limit);
                    data['recipes'] = docs;
                    return response.sendSuccess(res, "Successfully fetched the recipes.",data);
                }
                
            });
        }).limit(limit).skip(pageNumber * limit);
    }
    else if(searchBy == "tags"){
        const arraySearch = searchFor.split(" ")
        console.log(arraySearch);
        if(arraySearch.length == 0){
            console.log("Tags array is null.")
            response.sendBadRequest(res, "Tags array is null.")
        }
        else{
            RecipeModel.find({tags : {$in: arraySearch}, isPublic: true}, function(err1, docs){

                RecipeModel.countDocuments({tags : {$in: arraySearch}, isPublic: true}, function(err2, count){
                    if(err1){
                        throw err1;
                    }
                    else if(err2){
                        throw err2;
                    }
                    else if(typeof(docs) == "undefined" || !docs){
                        return res.sendBadRequest(res, "No docs found.");
                    }
                    else{
                        var data = {}
                        data['total_count'] = count;
                        data['pages'] = Math.ceil(count / limit);
                        data['recipes'] = docs;
                        return response.sendSuccess(res, "Successfully fetched the recipes.",data);
                    }


                });
            }).limit(limit).skip(pageNumber * limit);;
        }
    }
    else if(searchBy == "ingredients"){
        const arraySearch = searchFor.split(" ")
        console.log(arraySearch);
        if(arraySearch.length == 0){
            console.log("Ingredients array is null.")
            response.sendBadRequest(res, "Ingredients array is null.")
        }
        else{
            const findBy = [];
            for(let i = 0; i < arraySearch.length; i++){
                var ele = { "ingredients.ingredient": {$regex: arraySearch[i], $options : "i" },
                            "isPublic": true };
                findBy.push(ele);
            }
            console.log(findBy);
            RecipeModel.find({$or : findBy}, function(err1, docs){
                RecipeModel.countDocuments({$or : findBy}, function(err2, count){
                    if(err1){
                        throw err1;
                    }
                    else if(err2){
                        throw err2;
                    }
                    else if(typeof(docs) == "undefined" || !docs){
                        return res.sendBadRequest(res, "No docs found.");
                    }
                    else{
                        var data = {}
                        data['total_count'] = count;
                        data['pages'] = Math.ceil(count / limit);
                        data['recipes'] = docs;
                        return response.sendSuccess(res, "Successfully fetched the recipes.",data);
                    }

                });
            }).limit(limit).skip(pageNumber * limit);

        }
    }
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

exports.getSingleRecipe = function(req, res){
    if(!req.params.recipe_id || !req.params.user_id){
        console.log("No recipe id or user id present.");
        response.sendBadRequest(res, "No recipe id or user id present.")
    }
    else {
        RecipeModel.find({recipe_id : req.params.recipe_id, user_id : req.params.user_id}, function(err, recipe){

            if(recipe.user_id == req.params.user_id){
                return callback(res, err, recipe, "Successfully fetched the recipe.");
            }
            else{
                if(recipe.isPublic == false){
                    console.log("This recipe is private.")
                    return response.sendForbidden(res, "This recipe is private.");
                }
                else{
                    return callback(res, err, recipe, "Successfully fetched the recipe.");
                }
            }
        });
    }
}

exports.getRecipes = function(req, res){

    const pageNumber = parseInt(req.params.pageNumber);
    const limit = parseInt(req.params.limit);
    console.log(pageNumber);
    console.log(limit);

    RecipeModel.find({}, function(err1, docs){
        RecipeModel.countDocuments({}, function(err2, count){
            if(err1){
                throw err1;
            }
            else if(err2){
                throw err2;
            }
            else if(typeof(docs) == "undefined" || !docs){
                return response.sendBadRequest(res, "No docs found.");
            }
            else{
                var data = {}
                data['total_count'] = count;
                data['pages'] = Math.ceil(count / limit);
                data['recipes'] = docs;
                return response.sendSuccess(res, "Successfully fetched the recipes.",data);
            }

        });
    }).limit(limit).skip(pageNumber * limit);

}

exports.checkRecipe = function(req, res, next){

    RecipeModel.findOne({recipe_id : req.body.recipe_id}, function(err, doc){
        if(err){
            throw err;
        }
        if(!doc){
            response.sendNotFound(res, "Recipe cannot be found.");
        }
        else{
            if(recipe.isPublic == false){
                response.sendForbidden(res, "Recipe is not public.");
            }
            else{
                return next();
            }
        }

    });
}

