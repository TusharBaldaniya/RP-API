const express = require('express');
const viewrout = express.Router();
const authcontroller = require('../controllers/authcontroller');
const viewcontroller = require('../controllers/viewcontroller');

viewrout.param('id', (req, res, next, val) => {
    console.log(`param middleware ${val}`);
    next();
})

viewrout.get('/logout', viewcontroller.logout);
viewrout.get('/login', viewcontroller.loginpage);
viewrout.get('/register', viewcontroller.registerpage);
viewrout.get('/', authcontroller.islogin, viewcontroller.gettour);
// .post(authcontroller.authorize, tourcontroller.posttour);

// viewrout
//     .route('/:id')
//     .get(authcontroller.authorize, tourcontroller.gett);

module.exports = viewrout;