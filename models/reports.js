const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reporter_id: {
        type: String
    },
    to: {
        type: String
    },
    reason : {
        type: String,
        default: ""
    },
    comments: {
        type: String
    }
}, { timestamps: true });

const reportModel = mongoose.model("report", reportSchema);

module.exports = reportModel;