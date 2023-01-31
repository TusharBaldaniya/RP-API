const Tour = require('../model/tourmodel');
const catchasync = require('../util/catchAsync');

exports.loginpage = (req, res) => {
    res.status(200).render('login');
}
exports.registerpage = (req, res) => {
    res.status(200).render('register');
}

exports.gettour = catchasync(async (req, res, next) => {
    // 1) Get tour data from collection

    const queryobj = { ...req.query };
    const exclidedFields = ['page', 'sort', 'limit', 'fields'];
    exclidedFields.forEach(el => delete queryobj[el]);
    const querystr = JSON.stringify(queryobj);
    let query;
    if (req.user) query = Tour.find({ createdby: req.user.id }).populate('createdby');
    if (req.user.role === "admin") query = Tour.find().populate('createdby');

    const tours = await query;

    const user = req.user;
    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('tour', { tours, user });
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'there is no token');
    res.status(200).redirect('login');
}

