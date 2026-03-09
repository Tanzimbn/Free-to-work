const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String
    },
    message : {
        type: String
    }
}, { timestamps: true });

const feedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = feedbackModel;