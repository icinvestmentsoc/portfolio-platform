module.exports = {
    ping: ping_api
}
const Instrument = require("../models/instrument");
const mongoose = require("mongoose");
const request = require("request");

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
        history: []
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
        instrumObj.history.push({
            time: roundDate(Date.now()),
            price: newPrice
        });

        instrumObj.save();
    });
}

function roundDate(timeStamp){
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;
    return timeStamp;
}

