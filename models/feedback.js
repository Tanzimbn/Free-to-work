const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String
    },
    message : {
        type: String
    }
});

const feedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = feedbackModel;