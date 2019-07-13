'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var recipespostSchema = Schema( {
  userId: ObjectId,
  userName: String,
  Names:String,
  Ingredients:String,
  Description: String,
  createdAt: Date

} );

module.exports = mongoose.model( 'RecipesPost', recipespostSchema );
