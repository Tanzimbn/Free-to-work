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
        type: Date
    },
    time_limit: {
        type: Date
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
    max_bid: {
        type: SchemaTypes.Number
    }
});

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;