const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    user: {
        type: String
    },
    title: {
        type: String
    },
    detail: {
        type: String
    },
    category: {
        type: String
    },
    budget: {
        type: SchemaTypes.Number
    },
    time: {
        type: Da
    }
});

const postModel = mongoose.model("user", postSchema);
module.exports = postModel;