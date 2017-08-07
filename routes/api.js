var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var usercontext = null

router.post('/register', function (req, res) {
    User.register(new User(req.body.user),
        req.body.user.password,
        function (err, account) {
            if (err) {
                console.log("ERROR :: ", err);
                return res.status(500).json({
                    err: err
                });
            }
            req.body.username = req.body.user.username;
            req.body.password = req.body.user.password;
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});


router.post('/update', function (req, res) {
    if (req.isAuthenticated()) {
        var newUserData = req.body.user;
        if (newUserData.username != req.session.passport.user) {
            return res.status(403).json({
                message: 'Unauthorized!'
            });
        }

        User.update({
            _id: req.body.user._id
        }, {
            $set: {
                name: newUserData.name,
                email: newUserData.email
            }
        }, function (user) {
            return res.status(200).json({
                message: 'Updated!',
                user: user
            });
        })
    } else {
        return res.status(403).json({
            message: 'Unauthorized!'
        });
    }



});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log(err, user, info);
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }

        req.session.user = user;
        User.update({
            _id: user._id
        }, {
            $set: {
                last_login: new Date()
            }
        }, function () {
            console.log("Log In : " + user.username + " at " + new Date());
        });


        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            res.status(200).json({
                status: 'Login successful!',
                user: user
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }

    var user = req.user;

    user.password = null;

    res.status(200).json({
        status: true,
        user: user
    });

});
router.get('/getUser', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json({
            user: null
        });
    }

    var user = req.user;

    user.password = null;

    res.status(200).json({
        user: user
    });
});


/* DATA APIS*/

router.get('/orders', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }

    var orders = [];


    res.status(200).json({

    });
});

module.exports = router;