const mongoose = require("mongoose");

module.exports = mongoose.model("Instrument", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    symbol: String, // The acronym representing it
    name: String, // Full name represented by the symbol
    currentPrice: Number,
    history: [{
        time: Number,
        price: Number
    }]
}));