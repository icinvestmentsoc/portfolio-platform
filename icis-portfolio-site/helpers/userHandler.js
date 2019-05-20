module.exports = {
    login: login
}
const User = require("../models/user");
const mongoose = require("mongoose");

function login(name, attempt, callback) {
    create_new_user(name, attempt, (err, obj) => {
        user = obj.user;
        created = obj.created;

        console.log(created);

        if (created) {
            console.log("Created new account");
            // create a login token for them
        } else {
            check_hash(user, attempt, (verified) => {
                if (verified) {
                    console.log("Password is right");
                    // update the login token for them
                } else {
                    console.log("Password is wrong");
                    // say that the password is wrong
                }
            });
        }
    });
}

function create_new_user(name, pass, callback) {
    check_user_exists(name, (err, exists) => {
        if (!exists) {
            const userObj = new User({
                _id: new mongoose.Types.ObjectId(),
                uid: name,
                watchlists: [],
                hash: hash(pass)
            });
        
            userObj.save();
            callback(err, {"user": userObj, "created": true});
        } else {
            get_user_by_name(name, (err, user) => {
                callback(err, {"user": user, "created": false});
            });
        }
    })
}

function check_user_exists(name, callback) {
    User.find({uid: name}).exec((err, objs) => {
        callback(err, objs.length != 0);
    });
}

function get_user_by_name(name, callback) {
    User.findOne({uid: name}).exec((err, user) => {
        callback(err, user);
    });
}

function get_users_by_name(name, callback) {
    User.find({uid: { "$regex": name, "$options": "i" }}).exec((err, users) => {
        callback(err, users);
    });
}

function is_admin(uid, callback) {
    get_user_by_name(uid, (err, user) => {
        callback(err, user.admin);
    });
}

function hash(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
}

function check_hash(user, attempt, callback) {
    callback(user.hash == hash(attempt));
}

function get_activity(uid, callback) {
    get_user_by_name(uid, (err, user) => {
        callback(err, user.activity);
    });
}

function get_last_activity(uid, callback) {
    get_activity(uid, (err, activity) => {
        callback(err, activity[activity.length - 1]);
    })
}

