'use strict';
const MatterPost = require( '../models/MatterPost' );
const MatterComment = require( '../models/MatterComment' );

exports.saveMatterPost = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post to the Matter Manager.")
  }

  let newMatterPost = new MatterPost(
   {
    userId: req.user._id,
    userName:req.user.googlename,
    post: req.body.post,
    createdAt: new Date()
   }
  )

  //console.log("skill = "+newSkill)

  newMatterPost.save()
    .then( () => {
      res.redirect( 'matternew' );
    } )
    .catch( error => {
      res.send( error );
    } );
};


// this displays all of the skills
exports.getAllMatterPosts = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  MatterPost.find({}).sort({createdAt: -1})
    .exec()
    .then( ( posts ) => {
      res.render('matternew',{posts:posts,title:"Your Days Matter"})
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

exports.deleteMatterPost = (req, res) => {
  console.log("in deleteMatterPost")
  let deleteId = req.body.delete
  if (typeof(deleteId)=='string') {
      // you are deleting just one thing ...
      MatterPost.deleteOne({_id:deleteId})
           .exec()
           .then(()=>{res.redirect('/matternew')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='object'){
      MatterPost.deleteMany({_id:{$in:deleteId}})
           .exec()
           .then(()=>{res.redirect('/matternew')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='undefined'){
      //console.log("This is if they didn't select a skill")
      res.redirect('/matternew')
  } else {
    //console.log("This shouldn't happen!")
    res.send(`unknown deleteId: ${deleteId} Contact the Developer!!!`)
  }

};


// this displays all of the skills
exports.showOnePost = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is '+id)
  MatterPost.findOne({_id:id})
    .exec()
    .then( ( matterpost ) => {
      res.render( 'matterpost', {
        post:matterpost, title:"Matter Post"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};


exports.saveMatterComment = (req,res) => {
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post a comment to the Matter Manager.")
  }

  let newMatterComment = new MatterComment(
   {
    userId: req.user._id,
    postId: req.body.postId,
    userName:req.user.googlename,
    comment: req.body.comment,
    createdAt: new Date()
   }
  )

  //console.log("skill = "+newSkill)

  newMatterComment.save()
    .then( () => {
      res.redirect( 'showPost/'+req.body.postId );
    } )
    .catch( error => {
      res.send( error );
    } );
}




// this displays all of the skills
exports.attachAllMatterComments = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  console.log("in aAFC with id= "+req.params.id)
  var ObjectId = require('mongoose').Types.ObjectId;
  MatterComment.find({postId:ObjectId(req.params.id)}).sort({createdAt:-1})
    .exec()
    .then( ( comments ) => {
      console.log("comments.length=")
      console.dir(comments.length)
      res.locals.comments = comments
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
