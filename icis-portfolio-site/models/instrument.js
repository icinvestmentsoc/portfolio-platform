const mongoose = require("mongoose");

module.exports = mongoose.model("Instrument", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    symbol: String, // The acronym representing it
    name: String, // Full name represented by the symbol
    currentPrice: Number,
    lastPrice: Number, // previous 24hr? price
    history: [{
        time: Number,
        price: Number
    }],
    marketValue: Number // total market value for instrument
}));