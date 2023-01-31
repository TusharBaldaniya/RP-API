const User = require('../model/usermodel');
const catchasync = require('../util/catchAsync');

const filterobj = (obj, ...allowfields) => {
    const newobj = {};
    Object.keys(obj).forEach(el => {
        if (allowfields.includes(el)) newobj[el] = obj[el];
    });
    return newobj;
};
exports.getuser = async (req, res) => {
    let query = User.find();
    const getuser = await query;
    res.status(200).json({
        status: "success",
        user: getuser

    })
}
exports.updateme = catchasync(async (req, res, next) => {
    // console.log(req.user._id);
    const filterbody = filterobj(req.body, 'name')
    const user = await User.findByIdAndUpdate(req.user._id, filterbody, {
        new: true,
        runValidators: true
    });
    // console.log(user);
    res.status(200).json({
        status: "success",
        data: user
    })
});
exports.deleteme = catchasync(async (req, res, next) => {
    // console.log(req.user._id);

    const user = await User.findByIdAndUpdate(req.user._id, { active: false }, {
        new: true,
        runValidators: true
    });
    // console.log(user);
    res.status(200).json({
        status: "success",
        data: user
    })
});
