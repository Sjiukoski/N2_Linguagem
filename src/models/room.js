/**
 * config de esquema da base de dados
 */

 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 
 var RoomSchema = new Schema({
   name: String,
   capacity: Number
 });
 
 module.exports = mongoose.model("Room", RoomSchema);
 