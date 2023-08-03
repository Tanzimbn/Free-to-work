const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const verifySchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    nid : {
        type : String,
        required: true
    },
    gender: {
        type: String
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    division: {
        type: String
    },
    district: {
        type: String
    },
    station: {
        type: String
    },
    category: {
        type: String,
        default: ""
    },
    img : {
        data: Buffer,
        contentType:String
    },
    rating : {
        type: String,
        default: 0
    },
    bio: {
        type: String,
        default: ""
    },
    mood: {
        type: Boolean,
        default: true
    }
});

const verifyModel = mongoose.model("verify", verifySchema);

module.exports = verifyModel;