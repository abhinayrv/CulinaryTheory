const mongoose = require('mongoose');
const nanoid = require('nanoid');
const response = require('../helpers/response');
const bookmarkModel = mongoose.model('Bookmark');
const likemodel = mongoose.model('Like');
const commentModel = mongoose.model('comments');
const reportModel = mongoose.model('Report');
const userprofileModel = mongoose.model('userprofile');



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

    return response.sendSuccess(res, "Success", bookmarks);
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
      return response.sendBadRequest(res,"recipie id is missing or invalid");
    }

    likemodel.count(({recipe_id:req.params.recipe_id,is_liked:true}),function(err,likes){
        if (err) {
            throw err;
        }
        likemodel.count(({recipe_id:req.params.recipe_id,is_liked:false}),function(err,dislikes){
            if (err) {
              throw err;
            }
            return response.sendSuccess(res, "Success", {likes:likes, dislikes:dislikes});
        });  
    });
  };

exports.deleteLikedislike = function(req,res){
  

    if (!req.body.user_id || !req.body.recipe_id) 
    {
      return response.sendBadRequest(res, "Please check the userid or recipieid");
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
  exports.addComment = function(req,res){
    
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
    if (!req.params.recipe_id) {
      return response.sendBadRequest(res, 'recipe_id  is required');
    }

    var limit = 5;
    var pageNumber = 0;
    if(req.query.limit){
      limit = parseInt(req.query.limit);
    }
    if(req.query.pageNumber){
      pageNumber = parseInt(req.query.pageNumber);
    }
  
    commentModel.find({recipe_id: req.params.recipe_id}, function(err, comments){
      if (err){
          throw err;
      }    
      commentModel.count({recipe_id: req.params.recipe_id}).exec(function(err, totalComments){
        if (err){
               throw err;
           }
           data = {}
           data['page'] = pageNumber;
           data['total_count'] = totalComments;
           data['total_pages'] = Math.ceil(totalComments / limit);
           data['data'] = comments;
           return response.sendSuccess(res,"Successfully fetched comments." ,data);
      });
     }).sort({timestamps: -1}).limit(limit).skip(pageNumber * limit);
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

exports.getReports = function (req, res)  {

  var limit = 5;
  var pageNumber = 0;
  if(req.query.limit){
    limit = parseInt(req.query.limit);
  }
  if(req.query.pageNumber){
    pageNumber = parseInt(req.query.pageNumber);
  }
  
  reportModel.find({closed:false}, function(err, report){
    if (err){
        throw err;
    }    
    reportModel.count({closed:false}).exec(function(err, totalreports){
      if (err){
             throw err;
         }
         data = {}
         data['page'] = pageNumber;
         data['total_count'] = totalreports;
         data['total_pages'] = Math.ceil(totalreports / limit);
         data['data'] = report;
         return response.sendSuccess(res,"Successfully fetched reported recipes." ,data);
    
    }) 
   }).sort({timestamps: -1}).limit(limit).skip(pageNumber * limit);
}

exports.closeReport = function(req, res) {
  if (!req.body.user_id) {
    return response.sendBadRequest(res, "No user id");
  }

  if (!req.body.report_id) {
    return response.sendBadRequest(res, "No report id");
  }

  if (!req.body.action) {
    return response.sendBadRequest(res, "Action not specified");
  }

  reportModel.findOne({report_id: req.body.report_id}).exec(function(err, report){
    if(err) {
      console.log("Error finding report")
      throw err;
    }

    report.action = req.body.action;
    report.closed = true;
    report.action_by = req.body.user_id;

    report.save(function(err, report){
      if(err) {
        console.log("Error closing the report");
        throw err;
      }

      return response.sendSuccess(res, "Successfully closed the report");
    });
  });
}

//User Profile insert end
exports.createUserProfile = function(req,res){
    
  if (!req.body.user_id || !req.body.user_name) {
    return response.sendBadRequest(res, 'Required fields missing');
  }
  

  var userProfile = new userprofileModel(req.body);
  var err = userProfile.validateSync();
  
  if(err){
    return response.sendBadRequest(res, "Please check the data");
  }

  userProfile.save(function (err, userprofile){
    if (err){
      throw err;
    }

    return response.sendSuccess(res, "User Profile Saved", userprofile.toJSON());
  })
    };
//User Profile insert end 

//user profile get start
exports.getMyUserProfile= function (req, res)  {
  if (!req.body.user_id ) {
    return response.sendBadRequest(res, 'user_id is required');
  }
  userprofileModel.findOne({user_id: req.body.user_id}).exec(function(err, profileUser){
  if (err){
      throw err;
  }

  if(!profileUser){
    return response.sendSuccess(res, "Success", new userprofileModel().toJSON());
  }

  return response.sendSuccess(res, "Success", profileUser);
 });
}

// My
exports.getUserProfile = function (req, res)  {
  if (!req.params.query_user_id) {
    return response.sendBadRequest(res, 'user_id is required');
  }
  userprofileModel.findOne({user_id: req.params.query_user_id}).exec(function(err,profileUser){
  if (err){
      throw err;
  }

  return response.sendSuccess(res, "Success", profileUser);
 });
}
//user profile get end

//User profile edit start
exports.editUserProfile = function(req, res, next){
  console.log("In edit recipe.")
 
  if(!req.body.user_id || !req.body.user_name){
      return response.sendBadRequest(res, "UserId is missing")
  }

  userprofileModel.findOne({user_id:req.body.user_id}).exec(function (err,profileUser){
      if (err){
          console.log("There is some error in find one.");
          throw err;
      }
      if (!profileUser){
          console.log("Profile not found");
          if(req.session.user){
            console.log("Logged in user. Calling create profile");
            return next();
          }
          return response.sendBadRequest(res, "No profile found for the given id.");
      }
      
      validateUserProfileRequest(req.body, function(result){
          if(!result){
              console.log("In if")
              return response.sendBadRequest(res, "One of the fields is wrong/missing.")
          }
          else{
            profileUser.updateDoc(req.body);
            profileUser.save(function(err, profileUser){
              if (err) return response.sendBadRequest(res, "Please check the data entered.", err);
              return response.sendSuccess(res, "Successfully updated the doc.", profileUser.toJSON());
          });
      }
  });
});
}

function validateUserProfileRequest(reqBody, next){
  if (!reqBody.user_id || !reqBody.user_name){
          return next(false);
      }
      return next(true);
}
//User profile edit end


exports.isBookmarked = function(req, res){
  if(!req.params.user_id || !req.params.recipe_id){
    return response.sendBadRequest(res, "No user id found.");
  }
  else{
    bookmarkModel.findOne({user_id : req.params.user_id, recipe_id : req.params.recipe_id}, function(err, docs){

      if(err){
        throw err;
      }
      if(!docs){
        return response.sendSuccess(res, "User has not bookmarked any recipe.", {bookmarked : false});
      }
      else{
        return response.sendSuccess(res, "User has not bookmarked any recipe.", {bookmarked : true});
      }
    });
  }
}

exports.isLiked = function(req, res){
  if(!req.params.user_id || !req.params.recipe_id){
    return response.sendBadRequest(res, "No user id found.");
  }
  else{
    likemodel.findOne({user_id : req.params.user_id, recipe_id : req.params.recipe_id}, function(err, docs){

      if(err){
        throw err;
      }
      if(!docs){
        return response.sendSuccess(res, "User has not liked any recipe.", {liked : false, disliked: false});
      }
      else{
        if(docs.is_liked){
          return response.sendSuccess(res, "User has liked this recipe.", {liked : true, disliked: false});
        }
        else{
          return response.sendSuccess(res, "User has not liked this recipe.", {liked : false, disliked: true});
        }
        
      }
    });
  }
}
