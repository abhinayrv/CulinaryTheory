const mongoose = require('mongoose');
const nanoid = require('nanoid');
const response = require('../helpers/response');
const { report } = require('../routes');
const bookmarkModel = mongoose.model('Bookmark');
const likemodel = mongoose.model('Like');
const commentModel = mongoose.model('comments');
const reportModel = mongoose.model('Report');



exports.add_bookmark = function (req, res)  {
      if (!req.body.user_id || !req.body.recipe_id) {
        return response.sendBadRequest(res, 'Required fields missing');
      }
    
    
      bookmarkModel.findOne({user_id: req.body.user_id, recipe_id: req.body.recipe_id}).exec((err, bookmark)=>{
        if (err){
          throw err;
        }
        
        if (bookmark){
          return response.sendBadRequest(res, "Already bookmarked!");
        }
        
        req.body.bookmark_id = nanoid();
        bookmark = new bookmarkModel(req.body);
        var err = bookmark.validateSync();
        
        if(err){
          return response.sendBadRequest(res, "Please check the data");
        }

        bookmark.save(function (err, bookmark){
          if (err){
            throw err;
          }

          return response.sendSuccess(res, "Recipe bookmarked", bookmark.toJSON());
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

    response.sendSuccess(res, "Success", bookmarks);
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
    
    return response.sendSuccess(res, "Successfully deleted.", doc.toJSON());
});

};

exports.insertLikeDislike = function(req,res){

    
  
    if (!req.body.user_id|| !req.body.recipe_id || req.body.is_liked==null)
    {
     return response.sendBadRequest(res, "Required fields missing");
    } 

  
    likemodel.findOne({user_id:req.body.user_id, recipe_id:req.body.recipe_id}).exec((err,like)=>{
      if (err){
        throw err;
      }
      
      if (like){
        return response.sendBadRequest(res, "Already liked/disliked."); 
      }

      req.body.like_id = nanoid();
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

        return response.sendCreated(res, "Added like/dislike successfully.", like.toJSON());
      });
    
    });
  };



exports.countLikeDislike = function(req,res){
    
    if (!req.params.recipe_id){
      response.sendBadRequest(res,"recipie id is missing or invalid");
    }

    likemodel.count(({recipe_id:req.params.recipe_id,is_liked:true}),function(err,likes){
        if (err) {
            throw err;
        }
        likemodel.count(({recipe_id:req.params.recipe_id,is_liked:false}),function(err,dislikes){
            if (err) {
              throw err;
            }
            response.sendSuccess(res, "Success", {likes:likes, dislikes:dislikes});
        });  
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
          return response.sendNotFound(res);
        }
        
        return response.sendSuccess(res, "Successfully deleted.", doc.toJSON());
    })
  };
   
  //Comments Insert Start
  exports.comments = function(req,res){
    
    if (!req.body.user_id || !req.body.recipe_id ||!req.body.comment_text) {
      return response.sendBadRequest(res, 'Required fields missing');
    }
    
    req.body.comment_id = nanoid();
    
    comment = new commentModel(req.body);
        var err = comment.validateSync();
        
        if(err){
          return response.sendBadRequest(res, "Please check the data");
        }

        comment.save(function (err, comment){
          if (err){
            throw err;
          }

          return response.sendSuccess(res, "Comment Saved", comment.toJSON());
        })
      };
  //Comments Insert End

  //Comments Get start (message has total number of pages)
  exports.getcomments = function (req, res)  {
    if (!req.body.recipe_id) {
      return response.sendBadRequest(res, 'recipe_id  is required');
    }
  
    commentModel.find({recipe_id: req.body.recipe_id}).sort({timestamps: -1}).exec(function(err, comments){
    if (err){
        throw err;
    }    
    commentModel.count({recipe_id: req.body.recipe_id}).exec(function(err, totalComments){
      if (err){
             throw err;
         }
    const totalPages = Math.ceil(parseInt(totalComments)/parseInt(req.params.limit));    
    const startIndex = (req.params.page - 1) * req.params.limit;
    const endIndex = req.params.page * req.params.limit;
    commentsResult = comments.slice(startIndex,endIndex);
    response.sendSuccess(res,totalPages ,commentsResult);
    }) 
   });
  }
  //Comments Get end

  exports.add_reported_recipe = function (req, res)  {
    if (!req.body.user_id || !req.body.recipe_id) {
      return response.sendBadRequest(res, 'Reqired fields missing');
    }
  
  
    reportModel.findOne({user_id: req.body.user_id, recipe_id: req.body.recipe_id}).exec((err, report)=>{
      if (err){
        throw err;
      }
      
      if (report){
        return response.sendBadRequest(res, "Already reported!");
      }
      
      req.body.report_id = nanoid();
      report = new reportModel(req.body);
      var err = report.validateSync();
      
      if(err){
        return response.sendBadRequest(res, "Please check the data");
      }

      report.save(function (err, report){
        if (err){
          throw err;
        }

        return response.sendSuccess(res, "Recipe Reported", report.toJSON());
      });
    });

};

exports.getreportedrecipe = function (req, res)  {
  
  reportModel.find({closed:false}).sort({timestamps: -1}).exec(function(err, report){
  if (err){
      throw err;
  }    
  reportModel.count({closed:false}).exec(function(err, totalreports){
    if (err){
           throw err;
       }
  const totalPages = Math.ceil(parseInt(totalreports)/parseInt(req.params.limit));    
  const startIndex = (req.params.page - 1) * req.params.limit;
  const endIndex = req.params.page * req.params.limit;
  reportResult = report.slice(startIndex,endIndex);
  response.sendSuccess(res,totalPages ,reportResult);
  }) 
 });
}

// bookmark kiya ki nahi
// like ya dislike kiya ki nahi
exports.isBookmarked = function(req, res){
  if(!req.params.user_id || !req.params.recipe_id){
    response.sendBadRequest(res, "No user id found.");
  }
  else{
    bookmarkModel.findOne({user_id : req.params.user_id, recipe_id : req.params.recipe_id}, function(err, docs){

      if(err){
        throw err;
      }
      if(!docs){
        response.sendSuccess(res, "User has not bookmarked any recipe.", {bookmarked : false});
      }
      else{
        response.sendSuccess(res, "User has not bookmarked any recipe.", {bookmarked : true});
      }
    });
  }
}

exports.isLiked = function(req, res){
  if(!req.params.user_id || !req.params.recipe_id){
    response.sendBadRequest(res, "No user id found.");
  }
  else{
    likemodel.findOne({user_id : req.params.user_id, recipe_id : req.params.recipe_id}, function(err, docs){

      if(err){
        throw err;
      }
      if(!docs){
        response.sendSuccess(res, "User has not liked any recipe.", {liked : false});
      }
      else{
        if(docs.is_liked){
          response.sendSuccess(res, "User has liked this recipe.", {liked : true});
        }
        else{
          response.sendSuccess(res, "User has not liked this recipe.", {liked : false});
        }
        
      }
    });
  }
}


