// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Product = new Schema({
    pnumber: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    description: String,
    available: Boolean,
    availableCnt: Number,
    price: Number,
    currency: String,
    make: String,
    model: String,
    quantity: Number,
    compatibility: [
        String
    ],
    images: [String],
    thumbnail: String,
    disabled: Boolean
}, {
    collection: 'products'
});



Product.pre('save', function (next) {
    var prod = this;
    prod['pnumber'] = generateProductID(productTypes.cartridge);
    console.log(this);
    next();
})


var productTypes = {
    "cartridge": "CA"
}

function generateProductID(productType) {
    return 'UNI-' + productType + '-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}


module.exports = mongoose.model('products', Product);