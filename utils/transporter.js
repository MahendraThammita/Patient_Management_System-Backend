const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "10ff2704f5231f",
            pass: "9160aacc90a9b0"
        }
    });


