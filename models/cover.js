const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema({
    id: {
        type: String
    },
    cover : {
        data: Buffer,
        contentType:String
    }
}, { timestamps: true });

const coverModel = mongoose.model("cover", coverSchema);

module.exports = coverModel;