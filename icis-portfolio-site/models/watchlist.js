const mongoose = require("mongoose");

/**
 * Each watchlist is final and shouldn't be physically updated in the program. 
 * They can be 'updated' with new instruments through creating a new Watchlist
 * with them.
 */
module.exports = mongoose.model("Watchlist", mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // id for each watchlist
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String,
    instruments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument',
        shares: Number
    }],
    active: Boolean,
    history: [{
        time: Number,
        price: Number
    }],
    updateHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Update'
    }]
}));

/**
 * At the end of the each day, the price of instruments is evaluated and saved in the history
 * with a timestamp and the total price of the instruments, if the watchlist is set to active.
 * They can be deactivated but can't be reactivated physically due to time lag.
 * As such, create new fresh Watchlist should they wish to rewatch.
 */