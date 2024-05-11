const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/messages");

const messageSchema = new mongoose.Schema({
    nickname : {required : true, type : String},
    title : { required : true, type : String },
    content : { required : true, type : String },
    createdAt : { type : Date, default : Date.now }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;