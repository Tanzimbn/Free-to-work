const mongoose = require("mongoose");

const baseUserFields = {
    fname: { type: String },
    lname: { type: String },
    nid: { type: String, required: true },
    gender: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String },
    division: { type: String },
    district: { type: String },
    station: { type: String },
    category: { type: String, default: "" },
    img: { data: Buffer, contentType: String },
    rating: { type: String, default: 0 },
    bio: { type: String, default: "" },
    mood: { type: Boolean, default: true }
};

const userSchema = new mongoose.Schema({ ...baseUserFields }, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ nid: 1 });
userSchema.index({ category: 1 });
userSchema.index({ mood: 1, category: 1 });  // compound — used by notification fan-out

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
module.exports.baseUserFields = baseUserFields;
