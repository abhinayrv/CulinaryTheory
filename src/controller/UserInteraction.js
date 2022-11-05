const mongoose = require('mongoose')
//const bookmarkModel = require('./models/BookmarkSchema'); 
const bookmarkModel = require('../models/BookmarkSchema')
const monmodel = require('../models/LikeDislikeSchema');

exports.add_bookmark = function (request, response)  {
    const bookmark = new bookmarkModel(request.body);
    
    try {
      bookmarkModel.findOne({bookmark_id:bookmark.bookmark_id}).exec((err,bookmark1)=>{
        if (err){
          throw error
        }
        else if (bookmark1){
          response.status(400).send("Bookmark already exist");
      }
      else{
        bookmark.save();
        response.send("Bookmark  Added");
      }
    })
    } catch (error) {
      response.status(500).send(error);
    }
  };
  exports.getbookmarks = function (request, response)  {
    var fetchuserid = request.params.user_id;
 
   const bookmarks =  bookmarkModel.find({user_id:fetchuserid});
   
     try {
       response.send(bookmarks);
     } catch (error) {
       response.status(500).send(error);
     }
   };
   exports.deletebookmark = function (request, response) {
    var bookmark_id=request.params.bookmark_id

    const bookmarks =  bookmarkModel.deleteOne({bookmark_id:bookmark_id});
  
    try {
      
      response.send("Bookmark deleted");
    } catch (error) {
      response.status(500).send(error);
    }
  };
  exports.insertLikeDislike = function(req,res){

    console.log("inside post function");
  
    if ((req.body.User_Id == null) || (req.body.Recipe_Id==null) 
    || ((req.body.Is_Liked==false) && (req.body.Is_Disliked==false)))
    {
     res.send("Please check the data");
    } 
    else {
        const data = new monmodel({
        Like_Id:req.body.Like_Id,
        User_Id:req.body.User_Id,
        Recipe_Id:req.body.Recipe_Id,
        Is_Liked:req.body.Is_Liked,
        Is_Disliked:req.body.Is_Disliked
    });
  
    try {
      monmodel.findOne({User_Id:data.User_Id,Recipe_Id:data.Recipe_Id}).exec((err,data1)=>{
        if (err){
          throw err
        }
        else if (data1){
          res.status(400).send("Recipie already liked or disliked");
          //res.json(data1)  
        }
      else{
        const val = data.save();
  
        if (req.body.Is_Liked == true) {
          res.send(" Like Posted");
        } else if (req.body.Is_Disliked == true) {
          res.send(" Dislike Posted");
        }    
      }
    })
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
    
  
    //res.json(val);
    }
  };
  exports.functtest = function(req,res){
    fetchid=req.params.Recipe_Id;
    monmodel.find(({Recipe_Id:fetchid}),function(err,val){
        res.send(val);
    })
  };
  exports.countLikeDislike = function(req,res){
    fetchuserID= req.params.User_Id;
    fetchid=req.params.Recipe_Id;
    fetchlike = req.params.Is_Liked;
    fetchdislike = req.params.Is_Disliked;
    monmodel.count(({Recipe_Id:fetchid,Is_Liked:fetchlike,Is_Disliked:fetchdislike}),function(err,val){
        if (err) {
            res.send(err);
          } else {
            res.json(val);
          }
    })
  };

  exports.deleteLikedislike = function(req,res){
    fetchuserID= req.params.User_Id;
    fetchid=req.params.Recipe_Id;
    fetchlike = req.params.Is_Liked;
    fetchdislike = req.params.Is_Disliked;
  
    monmodel.findOneAndDelete(({User_Id:fetchuserID,Recipe_Id:fetchid}),function(err,doc){
        if (err) {
            res.send(err);
          } else {
            res.send("Deleted");
          }
    })
  };
   