module.exports = {
    login: login,
    logout: logout,
    getSessionUser: get_session_user
}
const User = require("../models/user");
const mongoose = require("mongoose");

function login(req, callback) {
    check_session_user_exists(req, (err, exists, user) => {
        console.log(exists);
        if (!exists) {
            verify(req, (err, verified, user) => {
                callback(err, verified, user);
            });
        } else {
            callback(err, true, user);
        }
    })
}

function verify(req, callback) {
    create_new_user(req.body.user, req.body.pass, (err, obj) => {
        user = obj.user;
        created = obj.created;
        attempt = req.body.pass;

        console.log(created);

        if (created) {
            console.log("Created new account");
            set_session_user(req, user);
            callback(err, true, user);
        } else {
            check_hash(user, attempt, (verified) => {
                if (verified) {
                    console.log("Password is right");
                    set_session_user(req, user);
                } else {
                    console.log("Password is wrong");
                }

                callback(err, verified, user);
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

function check_session_user_exists(req, callback) {
    if (req.session && req.session.user) {
        check_user_exists(req.session.user.uid, (err, exists) => {
            if (exists) {
                get_user_by_name(req.session.user.uid, (err, user) => {
                    set_session_user(req, user);
                    callback(err, exists, user);
                });
            } else {
                logout(req);
                callback(err, false, null);
            }
        });
    } else {
        callback(null, false, null);
    }
}

function set_session_user(req, user) {
    req.session.user = user;
}

function get_session_user(req, successCallback, failCallback) {
    if (req.session && req.session.user) {
        successCallback(req.session.user);
    } else {
        failCallback();
    }
}

function logout(req) {
    if (req.session) {
        req.session.destroy();
    }
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

