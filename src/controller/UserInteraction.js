const mongoose = require('mongoose')
//const bookmarkModel = require('./models/BookmarkSchema'); 
const bookmarkModel = require('../models/BookmarkSchema')
const likemodel = require('../models/LikeSchema');
const response = require('../helpers/response');

exports.add_bookmark = function (req, res)  {
      if (!req.body.user_id || !req.body.recipe_id) {
        return response.sendBadRequest(res, 'Reqired fields missing');
      }
    
    
      bookmarkModel.findOne({user_id: req.body.user_id, recipe_id: req.body.recipe_id}).exec((err, bookmark)=>{
        if (err){
          throw error;
        }
        
        if (bookmark){
          return response.sendBadRequest(res, "Already bookmarked!");
          // response.status(400).send("Bookmark already exist");
        }
        
        bookmark = new bookmarkModel(req.body);
        var err = bookmark.validateSync();
        
        if(err){
          return response.sendBadRequest(res, "Please check the data");
        }

        bookmark.save(function (err, bookmark){
          if (err){
            throw err;
          }

          return response.sendSuccess(res, bookmark);
        });
      });

  };

  exports.getbookmarks = function (req, res)  {
    if (!req.params.user_id) {
      return response.sendBadRequest(res, 'user_id is required');
    }
 
   bookmarkModel.find({user_id: req.params.user_id}).exec(function(err, bookmarks){
    if (err){
        throw err;
    }

    response.sendSuccess(res, bookmarks);
   });
  }

exports.deletebookmark = function (req, res) {
  console.log('In delete bookmark');
  if (!req.body.user_id || !req.body.recipe_id) {
      return response.sendBadRequest(res, 'user_id and recipe id are required');
  }

  bookmarkModel.findOneAndDelete(({user_id:req.body.user_id,recipe_id:req.body.recipe_id}),function(err,doc){
    if (err) {
        throw err;
      } 
    
    if (!doc) {
      return response.sendNotFound(res);
    }
    
    return response.sendSuccess(res, "deleted.");
});
    // 
  };

exports.insertLikeDislike = function(req,res){

    console.log("inside post function");
  
    if (!req.body.user_id|| !req.body.recipe_id || req.body.is_liked==null)
    {
     return response.sendBadRequest(res, "Required fields missing");
    } 

  
    likemodel.findOne({user_id:req.body.user_id, recipe_id:req.body.recipe_id}).exec((err,like)=>{
      if (err){
        throw err;
      }
      
      if (like){
        response.sendBadRequest(res, "Already liked/disliked."); 
      }
      like = new likemodel(req.body);
      var err = like.validateSync();
      
      if(err){
        console.log(err);
        return response.sendBadRequest(res, "Please check the data");
      }

      like.save(function(err, like){
        if (err){
          throw err;
        }

        return response.sendCreated(res, like);
      });
    
    });
  };



  exports.countLikeDislike = function(req,res){
    
    if (!req.params.recipe_id){
      response.sendBadRequest(res,"recipie id is missing or invalid");
    }

    likemodel.count(({recipe_id:req.params.recipe_id,is_liked:true}),function(err,val){
        if (err) {
            throw err;
        }
        response.sendSuccess(res,{likes:val});  
    });
  };

  exports.deleteLikedislike = function(req,res){
  

    if (!req.body.user_id || !req.body.recipe_id) 
    {
      response.sendBadRequest(res, "Please check the userid or recipieid");
    }
    
  
    likemodel.findOneAndDelete(({user_id:req.body.user_id,recipe_id:req.body.recipe_id}),function(err,doc){
        if (err) {
            throw err;
          } 
        
        if (!doc) {
          return response.sendNotFound();
        }
        
        return response.sendSuccess(res, "deleted.");
    })
  };
   