const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    post_id: {
        type: String,
        required: true
    },
    parent_id: {
        type: String,
        default: null
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comment", commentSchema);
