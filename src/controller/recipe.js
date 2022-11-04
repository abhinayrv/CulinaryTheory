const mongoose = require('mongoose')
const response = require('../helpers/response');
const request = require('../helpers/request');

const RecipeModel = mongoose.model('Recipes');

exports.create = function(req, res){
    console.log("In recipe create");
    
    const newRecipe = new RecipeModel(req.body);
    const err = newRecipe.validateSync();
    if (err){
        return response.sendBadRequest(res, "Please check the data entered.");
    }
    newRecipe.save(function(err, recipe){
        if (err) return response.sendBadRequest(res, err);
        response.sendCreated(res, recipe);
    });

}

