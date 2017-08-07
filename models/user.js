// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Product = require('./product');
var p = mongoose.model('products').schema;
var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        firstName: String,
        lastName: String,
        middleName: String,
        title: String
    },
    admin: Boolean,
    tel: Number,
    email: String,
    address: {
        street: Array,
        state: String,
        country: String,
        zip: Number
    },
    cart: [p],
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date,
    last_login: Date
});

User.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);