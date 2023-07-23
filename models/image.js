const mongoose = require("mongoose")

const imgSchema = new mongoose.Schema({
    name : String,
    img : {
        data: Buffer,
        contentType:String
    }
})

const imageModel = mongoose.model("image", imgSchema);
module.exports = imageModel;