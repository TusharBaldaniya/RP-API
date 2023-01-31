const User = require('../model/usermodel');
const { promisify } = require('util');
const crypto = require('crypto');
const catchasync = require('../util/catchAsync');
const sendmymail = require('../util/email');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
generatetoken = id => jwt.sign({ id: id }, 'this-is-my-new-secret-login', { expiresIn: '90d' });



exports.signup = catchasync(async (req, res, next) => {
    const NewUser = await User.create(req.body);
    const token = generatetoken(NewUser._id);

    res.status(200).json({
        status: "success",
        token,
        message: "user created",
        data: {
            user: NewUser
        }
    })
});

exports.login = catchasync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new Error('please enter email or password', 400);
        return next(err);
    }
    // console.log(email);
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        const err = new Error("email id is not valid or ither user in no longer ACTIVE!!!!");
        err.status = 'fail';
        err.statusCode = 400;
        return next(err);
    }


    if (!await user.correctPassword(password, user.password) || !user) {
        const err = new Error('invalid Id or password');
        err.statusCode = 401;
        return next(err);
    }
    const token = generatetoken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    res.cookie('jwt', token, cookieOptions);
    // else {
    //     console.log(user);
    // }
    res.status(200).json({
        status: "success",
        data: token
    })

});

exports.authorize = catchasync(async (req, res, next) => {
    let token = "";
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (req.headers.cookie) {
        let ck = req.headers.cookie.split('=').join(' ');
        token = ck.split(' ')[1];
    }
    if (!token) {
        return next(new Error("please enter valid token"));
    }

    const decode = await promisify(jwt.verify)(token, 'this-is-my-new-secret-login');

    const fresher = await User.findById(decode.id);

    if (!fresher) {
        return next(new Error("this user no longer exist"));
    }

    if (fresher.changepasswordafter(decode.iat)) {
        return next(new Error('password has been updated please login again'));
    }
    req.user = fresher;
    // console.log(req.user.id);
    next();
});


exports.islogin = catchasync(async (req, res, next) => {
    let token = "";
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (req.headers.cookie) {
        let ck = req.headers.cookie.split('=').join(' ');
        token = ck.split(' ')[1];
    }
    if (!token) {
        return next();
    }

    const decode = await promisify(jwt.verify)(token, 'this-is-my-new-secret-login');
    // console.log(decode);

    const fresher = await User.findById(decode.id);

    if (!fresher) {
        return next();
    }

    if (fresher.changepasswordafter(decode.iat)) {
        return next();
    }
    req.user = fresher;
    // console.log(req.user.id);
    next();
});

exports.ispermited = (...roles) => {
    return ((req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new Error("you don't have permission"))
        }
        next();
    });
};

exports.forgetpassword = catchasync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new Error("there is no user with this email"));
    }
    const resettoken = user.PassdResetToken();
    await user.save({ validateBeforeSave: false });
    console.log('Mail sent!' + resettoken);
    //await sendmymail({ message: resettoken });
    res.status(200).json({
        status: "success",
        resettoken
    })
});

exports.resetpassword = catchasync(async (req, res, next) => {

    const hastoken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordtoken: hastoken, passwordtokenexp: { $gt: Date.now() } });
    if (!user) {
        return next(new Error("token is invalid or expire!!"));
    }
    const token = generatetoken(user._id);
    user.password = req.body.password;
    user.confirm_password = req.body.confirm_password;
    user.passwordtoken = "undefined";
    user.passwordtokenexp = 0000;
    await user.save();

    res.status(200).json({
        status: "success",
        token
    })
})

exports.updatepassword = catchasync(async (req, res, next) => {

    if (!req.body.curruntpassword) {
        return next(new Error("please enter c pass"));
    }
    const cp = req.body.curruntpassword;
    const user = await User.findOne({ _id: req.user.id }).select('+password');

    if (!user) {
        return next(new Error("invalid email or currunt password"));
    }
    if (!await user.correctPassword(cp, user.password)) {
        return next(new Error("currunt password did not match"));
    }
    user.password = req.body.newpassword;
    user.confirm_password = req.body.confirm_newpassword;
    await user.save();
    const token = generatetoken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
})