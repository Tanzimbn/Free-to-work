const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
    nid: {
        type: String
    }
}, { timestamps: true });

const blockModel = mongoose.model("block", blockSchema);

module.exports = blockModel;