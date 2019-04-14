const mongoose = require("mongoose");

module.exports = mongoose.model("Transaction", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // id for each transaction
    instrument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instrument"
    },
    buyTime: {
        type: Number,
        default: undefined
    },
    sellTime: {
        type: Number,
        default: undefined
    },
    shares: Number, // amount of units sold/bought
    price: Number, // price per unit,
    buying: Boolean,
    active: Boolean,
    closePrice: Number,
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        remark: String
    }]
}));