const mongoose = require("mongoose");
var SchemaTypes = mongoose.Schema.Types;

const coverSchema = new mongoose.Schema({
    id: {
        type: String
    },
    cover : {
        data: Buffer,
        contentType:String
    }
});

const coverModel = mongoose.model("cover", coverSchema);

module.exports = coverModel;