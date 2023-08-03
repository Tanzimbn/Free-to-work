const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema({
    value: {
        type: String
    }
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;