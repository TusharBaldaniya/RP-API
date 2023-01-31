const nodemailer = require('nodemailer');
const sendmymail = async option => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });
    var mailOptions = {
        from: 'Laravel<laraveltester@node.com>',
        to: 'laraveltester123@yopmail.com',
        subject: 'Sending Email using Node.js',
        text: option.message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

};
module.exports = sendmymail;