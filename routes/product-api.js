var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../models/product.js');

var User = require('../models/user.js');

router.get("/list", function (req, res) {
    Product.find({}, function (err, products) {
        res.send(products);
    });
});

router.get("/:productId", function (req, res) {
    var pid = req.params.productId;
    Product.findOne({
        'pnumber': pid
    }, function (err, product) {
        if (err) {
            res.status(404).send(err);
        }
        res.send(product);
    });
});


router.post("/add", function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }
    var p = req.body;
    var product = new Product(p);
    product.save(function (err, prod) {
        if (err) {
            res.status(500).send(err);
        }

        res.status(200).send(prod);
    });
});

router.post("/delete", function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }

    var pnumber = req.body.pnumber;

    User.find({
        'cart': {
            $elemMatch: {
                pnumber: pnumber
            }
        }
    }, function (err, users) {
        if (err) {
            res.status(500).send(err);
        }

        users.forEach(function (user) {
            var prod = {
                "name": "Product has been removed (",
                "pnumber": ""
            }
            user.cart.forEach(function (obj, i) {
                if (obj.pnumber == pnumber) {
                    //user.cart.splice(i, 1);
                    prod.name = prod.name + obj.name + ")";
                    var p = new Product(prod);
                    user.cart[i] = p;
                    //break;
                }
            });
            user.save();
        });

    });


    Product.remove({
        pnumber: pnumber
    }, function (err) {
        if (err)
            res.status(500).send({});
        else
            res.status(200).send({
                "message": "Deleted Successfully"
            });
    });



});


router.get("/update", function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }
    //add a  products
});

router.get("/existsInCart/:pnumber", function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }
    var pnumber = req.params.pnumber;
    User.findOne({
        '_id': req.session.user._id
    }, {
        'cart': {
            $elemMatch: {
                pnumber: pnumber
            }
        }
    }, function (err, model) {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send(model.cart.length > 0);
    });

});

/*

db.lists.update({}, {$unset : {"interests.3" : 1 }}) 
db.lists.update({}, {$pull : {"interests" : null}})
*/

router.post("/removeFromCart", function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }
    var pnumber = req.body.pnumber;

    console.log(pnumber);
    User.findByIdAndUpdate(req.session.user._id, {
            $pull: {
                cart: {
                    pnumber: pnumber
                }
            }
        },
        function (err, model) {
            if (err)
                res.status(500).send(err);

            res.status(200).send(model.cart);
        })


});

router.post("/pushToCart", function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(403).json();
    }
    var p = req.body;
    var product = new Product(p);

    console.log("======================");
    console.log(p);
    console.log("======================");
    console.log(product);
    User.findByIdAndUpdate(req.session.user._id, {
            $push: {
                "cart": product
            }
        }, {
            safe: true,
            upsert: true
        },
        function (err, model) {
            if (err)
                res.status(500).send(err);

            res.status(200).send(model.cart);
        }
    );

});



module.exports = router;