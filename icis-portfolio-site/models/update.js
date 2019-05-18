const mongoose = require("mongoose");

module.exports = mongoose.model("Update", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: String,
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    info: String,
    time: Number
}));