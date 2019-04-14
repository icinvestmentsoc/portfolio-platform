const mongoose = require("mongoose");

module.exports = mongoose.model("User", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: String,
    watchlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watchlist',
    }],
    admin: {
        type: Boolean,
        default: false
    }
}));