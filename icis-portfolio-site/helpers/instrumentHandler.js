module.exports = {
    ping: ping_api,
    getLatestInstruments: get_latest_instruments,
    getLatestInstrument: get_latest_instrument,
    getLatestInstrumentSpread: get_latest_instruments_spread
}
const Instrument = require("../models/instrument");
const mongoose = require("mongoose");
const request = require("request");

const RANGE_OF_HISTORY_DAYS = 60;

const apiInfo = "https://financialmodelingprep.com/developer/docs";
const apiLink = "https://financialmodelingprep.com/api/stock/list/all?datatype=json";

function ping_api() {
    request.get(apiLink, (err, res, body) => {
        var data = JSON.parse(body);

        data.map(info => {
            update_price(info["Ticker"], info.companyName, info["Price"]);
            console.log("Updated " + info["Ticker"]);
        });
    });
}


function create_instrument(symbol, name, price) {
    const instrumObj = new Instrument({
        _id: new mongoose.Types.ObjectId(),
        symbol: symbol,
        name: name,
        currentPrice: price,
        history: [],
        watching: []
    });

    return instrumObj;
}

function update_price(symbol, name, newPrice) {
    Instrument.findOne({"symbol": symbol}, (err, instrum) => {
        var instrumObj = instrum;

        if (instrum == null) {
            instrumObj = create_instrument(symbol, name, newPrice);
        }

        instrumObj.currentPrice = newPrice;
        if (instrumObj.history.length == RANGE_OF_HISTORY_DAYS) {
            instrumObj = instrumObj.slice(1);
        }

        instrumObj.history.push({
            time: round_date(Date.now()),
            price: newPrice
        });

        instrumObj.save();
    });
}

function round_date(timeStamp){
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;
    return timeStamp;
}

function get_latest_instruments(callback) {
    Instrument.find({}, (err, res) => {
        callback(err, res);
    });
}

function get_latest_instrument(symbol, callback) {
    Instrument.find({"symbol": symbol}, (err, res) => {
        callback(err, res);
    });
}

function get_latest_instrument_by_watching(callback) {
    Instrument.find({})
    .sort({"watching": "desc"})
    .exec((err, res) => {
        callback(err, res);
    });
}

function get_latest_instruments_spread(callback, amount) {
    Instrument.find({})
    .sort({"watching": "desc"})
    .limit(amount)
    .lean()
    .exec((err, res) => {
        callback(err, res.map(instrum => get_daily_weekly_monthly_average(instrum)));
    });
}

function get_daily_weekly_monthly_average(instrum) {
    newInstrum = instrum;
    history = instrum.history;

    newInstrum.curr_price = get_current_price(history);
    newInstrum.prev_price = get_previous_price(history);
    newInstrum.week_avg = get_weekly_average(history);
    newInstrum.month_avg = get_monthly_average(history);
    console.log(newInstrum);

    return newInstrum;
}

function get_current_price(history) {
    console.log(history);
    return history[history.length - 1].price;
}

function get_previous_price(history) {
    if (history.length >= 2) {
        return history[history.length - 2].price;
    } else {
        return get_current_price(history);
    }
}

function get_weekly_average(history) {
    weekSlice = history.slice(-7);
    console.log(weekSlice);
    return (weekSlice.reduce((x, y) => x.price + y.price) / weekSlice.length).toFixed(2);
}

function get_monthly_average(history) {
    monthSlice = history.slice(-30);
    return (monthSlice.reduce((x, y) => x.price + y.price) / monthSlice.length).toFixed(2);
}