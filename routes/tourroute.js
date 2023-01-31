const express = require('express');
const trout = express.Router();
const authcontroller = require('../controllers/authcontroller');
const tourcontroller = require('../controllers/tourcontroller');

trout.param('id', (req, res, next, val) => {
    console.log(`param middleware ${val}`);
    next();
})
trout
    .route('/')
    .get(authcontroller.authorize, tourcontroller.gettour)
    .post(authcontroller.authorize, tourcontroller.posttour);
trout
    .route('/:id')
    .get(authcontroller.authorize, tourcontroller.gett);

module.exports = trout;