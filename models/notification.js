const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const notiSchema = new mongoose.Schema({
    user: {
        type: String
    },
    type: {
        type: String
    },
    postid: {
        type: String
    },
    unseen: {
        type: Boolean,
        default: true
    }
});

const notiModel = mongoose.model("notification", notiSchema);
module.exports = notiModel;