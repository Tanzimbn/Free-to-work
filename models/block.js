const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const blockSchema = new mongoose.Schema({
    nid: {
        type: String
    }
});

const blockModel = mongoose.model("block", blockSchema);

module.exports = blockModel;