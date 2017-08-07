var express = require('express');
var router = express.Router();
var passport = require('passport');


/* DATA APIS*/

router.get('/orders', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }

    var orders = [
        {
            title: "Test 1",
            date: new Date(),
            price: "234"
        },
        {
            title: "Test 2",
            date: new Date("11Jan2017"),
            price: "1022"
        },
        {
            title: "Test 3",
            date: new Date(),
            price: "45",
            remarks: "Collected by Mr X"
        },
        {
            title: "Test 4",
            date: new Date("24Nov2011"),
            price: "176"
        },
        {
            title: "Test 5",
            date: new Date("21Dec2016"),
            price: "11"
        }
    ];


    res.status(200).json({
        orders: orders
    });
});

module.exports = router;