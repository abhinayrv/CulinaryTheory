const mongoose = require('mongoose')
const nanoid = require('nanoid');
const response = require('../helpers/response');
const request = require('../helpers/request');

const DraftModel = mongoose.model('Drafts');

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
    console.log("In draft create");
    req.body.draft_id = nanoid();
    const newDraft = new DraftModel(req.body);
    const err = newDraft.validateSync();
    if (err){
        console.log(err);
        return response.sendBadRequest(res, "Please check the data entered.", err);
    }
    newDraft.save(function(err, draft){
        if (err) return response.sendBadRequest(res, err);
        response.sendCreated(res, "Successfully created the draft", newDraft.toJSON());
    });
}

exports.edit = function(req, res){
    console.log("In edit draft")
    if(!req.body.draft_id){
        return response.sendBadRequest(res, "Draft Id not in request.")
    }

    DraftModel.findOne({draft_id:req.body.draft_id}).exec(function (err, draft){
        if (err){
            console.log("There is some error in find one.");
            throw err;
        }
        if (!draft){
            console.log("Doc not found.")
            return response.sendBadRequest(res, "No document found for the given id.");
        }

        if (draft.user_id != req.body.user_id) {
            return response.sendForbidden(res);
        }
        
       
        draft.updateDoc(req.body);
        const err1 = newDraft.validateSync();
        if(err1){
            return response.sendBadRequest(res, "Please check the data entered.", err1)
        }
        draft.save(function(err2, draft){
        if (err2) return response.sendBadRequest(res, "Please check the data entered.", err2);
        response.sendSuccess(res, "Successfully updated the doc.", draft.toJSON());
    });
        
});
}

exports.delete = function(req, res){
    console.log("In delete draft");
    if(!req.body.user_id || !req.body.draft_id){
        console.log("No user id or draft id present.");
        response.sendBadRequest(res, "No user id or draft id present.")
    }
    else{
        
        console.log("Deleting draft by particular user.")
        DraftModel.deleteOne({user_id : req.body.user_id, draft_id : req.body.draft_id}, function(err){
            var sucMessage = 'Successfully deleted the document by user.';
            return callback(res, err, undefined, sucMessage);
        });

    }

}
