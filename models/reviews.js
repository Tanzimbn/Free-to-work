const mongoose = require("mongoose");

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
}, { timestamps: true });

const reviewModel = mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;