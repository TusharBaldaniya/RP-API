const express = require('express');
const user = express.Router();
const authcontroller = require('../controllers/authcontroller');
const usercontroller = require('../controllers/usercontroller');


user.post('/signup', authcontroller.signup);
user.post('/login', authcontroller.login);
user.post('/forgot-password', authcontroller.forgetpassword);
user.patch('/resetpassword/:token', authcontroller.resetpassword);
user.patch('/updatepassword', authcontroller.authorize, authcontroller.updatepassword)
user.patch('/updateMe', authcontroller.authorize, usercontroller.updateme)
user.delete('/deleteMe', authcontroller.authorize, usercontroller.deleteme)

user.route('/')
    .get(authcontroller.authorize, authcontroller.ispermited('admin'), usercontroller.getuser)

module.exports = user;