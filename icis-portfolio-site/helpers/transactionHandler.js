module.exports = {
    handleIncomingTransactions: handle_incoming_transactions
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
                    //TODO: add an accompanying new trade and close both
                    Transaction.findByIdAndUpdate(trades[0]._id, {active: false});
                } else {
                    
                    add_transaction(transObj);
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
        callback(err, res);
    });
}

/**
 * @name add_transaction
 * @description Adds transaction to the database
 * @param {Array[Transaction]} transObj | Transaction Object
 */
function add_transaction(transObj) {
    const transactionObj = new Transaction({
        // TODO: ADD REST OF DATA
        _id: new mongoose.Types.ObjectId(),
        shares: transObj.units,
        price: transObj.price,
        buying: buying(transObj.bought),
        active: true
        
    })

    transactionObj.save();
}

/**
 * @name buying
 * @description Helper for turning boughtState into boolean
 * @param {Number} boughtState | 1 or -1 status
 * @returns {Boolean} If the transaction is a buying the instrument
 */
function buying(boughtState) {
    return (boughtState == 1);
}