const nodemailer = require('nodemailer');
const defaultEmail = process.env.EMAIL 
const passEmail = process.env.EMAIL_PASSWORD

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: defaultEmail,
        pass: passEmail
    }
});



module.exports = transporter