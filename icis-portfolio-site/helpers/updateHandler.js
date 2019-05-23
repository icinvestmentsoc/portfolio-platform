module.exports = {
    getLatestSnapshots: get_latest_snapshots,
    createNewUpdate: add_update
}

const mongoose = require("mongoose");
const Update = require("../models/update");

function add_update(urlStr, userID, infoStr, callback = () => {}) {
    const updateObj = new Update({
        _id: new mongoose.Types.ObjectId(),
        url: urlStr,
        uid: userID,
        info: infoStr,
        time: Date.now()
    });

    updateObj.save((err, updateObj) => {
        callback(err, updateObj);
    });
}

function get_updates_by_user(userID, callback) {
    Update.find({uid: userID}).lean().exec((err, updates) => {
        callback(err, updates);
    });
}

function get_update_snapshot(updateObj, callback) {
    var str = updateObj.info + " <span class='time'>" + get_date(updateObj.time) + "</span>";
    callback("<a class='update-snapshot' href='" + updateObj.url + "'>" + str + "</a>");
}

function get_latest_updates(count, modFunc = (x, cb) => {return x}, callback) {
    Update.find({}).limit(count).sort({time: -1}).lean().exec((err, updates) => {
        var updatesList = [];
        for (update of updates) {
            console.log(update);
            modFunc(update, (moddedItem) => {
                updatesList.push(moddedItem);
            });
        }
        callback(err, updatesList);
    });
}

function get_latest_snapshots(count, callback) {
    get_latest_updates(count, get_update_snapshot, (err, updatesList) => {
        callback(err, updatesList);
    });
}

function get_date(unixTime) {
    var timeObj = new Date(unixTime);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return timeObj.getDate() + " " + months[timeObj.getMonth()] + " " + timeObj.getFullYear();
}