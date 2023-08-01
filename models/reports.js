const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

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

});

const reportModel = mongoose.model("report", reportSchema);

module.exports = reportModel;