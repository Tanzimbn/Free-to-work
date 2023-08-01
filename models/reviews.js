const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema({
    id: {
        type: String
    },
    reviewer: {
        type: String
    },
    text: {
        type: String
    },
    rating: {
        type: String
    }
});

const reviewModel = mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;