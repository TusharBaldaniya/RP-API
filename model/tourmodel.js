const mongoose = require('mongoose');
const usermodel = require('./usermodel');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdby: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'tour must belong to a user']
    },
    price: {
        type: Number,
        required: true
    },
    startdate: {
        type: Date,
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// schema.virtual('duration').get(function (next) {
//     return 'hrllo';
//     next(); 
// });
schema.pre('save', function (next) {
    console.log(this);
    next();
});
// Schema.methods.changep = function (JWTtime) {
// schema.pre(/^find/, function (next) {

//     this.find({ createdby: "615be9d6af777b1d40af1606" })
//     next();
// })
// schema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { name: { $ne: 'name from api' } } });
//     next();
// });
const tour = mongoose.model('tour', schema);
module.exports = tour;