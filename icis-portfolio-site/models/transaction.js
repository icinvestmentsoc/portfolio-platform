const mongoose = require("mongoose");

module.exports = mongoose.model("Transaction", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // id for each transaction
    instrument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instrument"
    },
    buyTime: Number,
    sellTime: Number,
    shares: Number, // amount of units sold/bought
    price: Number, // price per unit,
    buying: Boolean,
    active: Boolean,
    closePrice: Number,
    comments: [{
        uid: String,
        remark: String
    }]
}));