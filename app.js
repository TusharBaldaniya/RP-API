const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser')
const trout = require('./routes/tourroute.js');
const userroute = require('./routes/userroute.js');
const viewroute = require('./routes/viewroute.js');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(express.json());
app.use(express.static(`${__dirname}`))

// app.use((req, res, next) => {
//     console.log('hello from middle');
//     next();
// })

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tour.json`));

app.use('/view', viewroute);
app.use('/api', trout);
app.use('/user', userroute);
app.post('/demologin', (req, res) => {
    console.log("Using Body-parser: ", req.body.email)
})
// app.get('/', gettour);
// app.post('/', posttour);
// app.get('/:id', gett);

app.all('*', (req, res, next) => {
    const err = new Error('cant find your url');
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});


app.use((err, req, res, next) => {
    let error = { ...err }
    if (error.name === 'JsonWebTokenError') {
        err.message = "please login again";
        err.statusCode = 401;
        return res.status(401).redirect('view/login');
    }
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'errors';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,


    })
});
module.exports = app;