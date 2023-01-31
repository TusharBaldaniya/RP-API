const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter name'],
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, 'please Enter password'],
        minlength: 8,
        select: false
    },
    confirm_password: {
        type: String,
        required: [true, 'please Enter c_password'],
        minlength: 8,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'password not match'
        }
    },
    changePasswordAt: {
        type: Date,
        default: Date.now()
    },
    passwordtoken: String,
    passwordtokenexp: Date,
    active: {
        type: Boolean,
        default: true
    }
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = "undefined";
    next();
})
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    // console.log(this.changePasswordAt);
    this.changePasswordAt = Date.now() - 1000;
    // console.log(this.changePasswordAt);
    next();
})
UserSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next();
})
UserSchema.methods.correctPassword = async function (userpassword, dbpassword) {
    return await bcrypt.compare(userpassword, dbpassword)
};

UserSchema.methods.changepasswordafter = function (JWTtime) {
    if (this.changePasswordAt) {
        const timestamp = parseInt(this.changePasswordAt.getTime() / 1000, 10);
        return JWTtime < timestamp;
    }
    return false;
}

UserSchema.methods.PassdResetToken = function () {
    const resettoken = crypto.randomBytes(32).toString('hex');
    this.passwordtoken = crypto.createHash('sha256').update(resettoken).digest('hex');
    this.passwordtokenexp = Date.now() + 10 * 60 * 1000;
    return resettoken;
}

const user = mongoose.model('user', UserSchema)
module.exports = user;