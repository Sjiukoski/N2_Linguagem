/**
 * config de esquema da base de dados
 */

 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 
 var UserSchema = new Schema({
   name: String,
   login: String,
   password: String
 });
 
 module.exports = mongoose.model("User", UserSchema);
 