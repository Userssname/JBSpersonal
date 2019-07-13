'use strict';
const RecipesPost = require( '../models/RecipesPost' );

exports.saveRecipesPost = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post to the Recipes Manager.")
  }

  let newRecipesPost = new RecipesPost(
   {
    userId: req.user._id,
    userName:req.user.googlename,
    Names:req.body.Names,
    Ingredients:req.body.Ingredients,
    Description: req.body.Description,
    createdAt: new Date()
   }
  )

  //console.log("skill = "+newSkill)

  newRecipesPost.save()
    .then( () => {
      res.redirect( 'recipes' );
    } )
    .catch( error => {
      res.send( error );
    } );
};


// this displays all of the skills
exports.getAllRecipesPosts = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  RecipesPost.find({}).sort({createdAt: -1})
    .exec()
    .then( ( posts ) => {
      res.render('recipes',{posts:posts,title:"Your Days Recipes"})
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

exports.deleteRecipesPost = (req, res) => {
  console.log("in deleteRecipesPost")
  let deleteId = req.body.delete
  if (typeof(deleteId)=='string') {
      // you are deleting just one thing ...
      RecipesPost.deleteOne({_id:deleteId})
           .exec()
           .then(()=>{res.redirect('/recipes')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='object'){
      RecipesPost.deleteMany({_id:{$in:deleteId}})
           .exec()
           .then(()=>{res.redirect('/recipes')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='undefined'){
      //console.log("This is if they didn't select a skill")
      res.redirect('/recipes')
  } else {
    //console.log("This shouldn't happen!")
    res.send(`unknown deleteId: ${deleteId} Contact the Developer!!!`)
  }

};
