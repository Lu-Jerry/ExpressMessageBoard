const mongoose = require("mongoose");
mongoose.createConnection("mongodb://127.0.0.1/members");

const messageSchema = new mongoose.Schema({
    account : { required : true, type:String },
    name : { required : true, type : String },
    password : { required : true, type : String },
    createdAt : { type : Date, default : Date.now }
});

const Members = mongoose.model("Members", messageSchema);

module.exports = Members;