module.exports = {
    handleIncomingTransactions: handle_incoming_transactions,
    getTransactions: get_transactions,
    getActiveTransactions: get_active_transactions
}

const Transaction = require("../models/transaction");
const Instrument = require("../models/instrument");
const mongoose = require("mongoose");

/**
 * @name handle_incoming_transactions
 * @description Apply processing of each transaction
 * @param {Array[Transaction]} transObjs | Array of transactions as object elements
 */
function handle_incoming_transactions(transObjs) {
    transObjs.map(trans => process_transaction(trans));
}

/**
 * @name process_transaction
 * @description Either adds a new trade or closes a pair of trades
 * @param {Transaction} transObj | Transaction Object
 */
function process_transaction(transObj) {
    get_instrument_id(transObj.symbol, (err, instrum) => {
        find_opposing_trades(instrum._id, transObj.units, transObj.boughts, 
            (err, trades) => {
                if (trades.length == 1) {
                    var trade = trades[0];
                    var buyTime = (trade.buyTime) ? trade.buyTime : transObj.date;
                    var sellTime = (trade.sellTime) ? trade.sellTime : transObj.date;

                    Transaction.findByIdAndUpdate(trades[0]._id, {
                        active: false,
                        closePrice: transObj.price,
                        buyTime: unix(buyTime),
                        sellTime: unix(sellTime)
                    }, () => {});
                } else {
                    var addingTransObj = transObj;
                    addingTransObj.instrument = instrum._id;
                    add_transaction(addingTransObj);
                }
            }
        )
    });
}

/**
 * @name get_instrument_id
 * @description Either adds a new trade or closes a pair of trades
 * @param {String} symbol | Symbol id
 * @param {Function(err, res)} callback | Function accepting (err, instrument)
 */
function get_instrument_id(symbol, callback) {
    Instrument.findOne({"symbol": symbol}, (err, res) => {
        callback(err, res);
    });
}

/**
 * @name find_opposing_trades
 * @description Finds whether there exists an active opposing trade and it
 * @param {String} instrumentID | String _id of instrument
 * @param {Number} units | Units of shares
 * @param {Number} bought | 1 or -1 status
 * @param {Function(err, res)} callback | Function accepting (err, active_trades)
 */
function find_opposing_trades(instrumentID, units, bought, callback) {
    Transaction.find({
        "instrument": instrumentID,
        "shares": units, 
        "buying": !buying(bought),
        "active": true
    })
    .sort([['date', 'asc']])
    .limit(1)
    .exec((err, res) => {
        console.log("Received");
        console.log(res);
        callback(err, res);
    });
}

/**
 * @name add_transaction
 * @description Adds transaction to the database
 * @param {Array[Transaction]} transObj | Transaction Object
 */
function add_transaction(transObj) {
    var buyState = buying(transObj.bought);
    var buyTime = buyState ? transObj.date : undefined;
    var sellTime = buyState ? undefined : transObj.date;

    const transactionObj = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        instrument: transObj.instrument,
        shares: transObj.units,
        price: transObj.price,
        buying: buyState,
        active: true,
        buyTime: unix(buyTime),
        sellTime: unix(sellTime),
        comments: []
    })

    transactionObj.save();
}

/**
 * @name buying
 * @description Helper for turning boughtState into boolean
 * @param {Number} boughtState | 1 or -1 status
 * @returns {Boolean} Returns true if transaction is buying the instrument
 */
function buying(boughtState) {
    return (boughtState == 1);
}

/**
 * @name get_transactions
 * @description Gives a sorted array of all transactions
 * @param {Function(err, res)} callback | Function accepting (err, Array[Transaction])
 */
function get_transactions(callback) {
    Transaction.find({})
    .populate({
        path: "instrument"
    })
    .exec((err, res) => {
        callback(err, sort_by_date(res));
    });
}

/**
 * @name get_active_transactions
 * @description Gives a sorted array of all active transactions
 * @param {Function(err, res)} callback | Function accepting (err, Array[Transaction])
 */
function get_active_transactions(callback) {
    Transaction.find({active: true})
    .populate({
        path: "instrument"
    })
    .exec((err, res) => {
        callback(err, sort_by_date(res));
    });
}

/**
 * @name sort_by_date
 * @description Sort an array of transactions by earliest interaction date
 * @param {Array[Transaction]} transArray Array of transactions
 * @returns {Array[Transaction]} Array of sorted transactions
 */
function sort_by_date(transArray) {
    var copy = transArray;
    copy.sort((a, b) => {
        var aTime = (a.buying) ? a.buyTime : a.sellTime;
        var bTime = (b.buying) ? b.buyTime : b.sellTime;
        return aTime - bTime;
    });
    return copy;
}

function unix(excelDate) {
    return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
}