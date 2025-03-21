const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    // Set default sender information here
    defaults: {
        from: {
            name: process.env.EMAIL_SENDER_NAME || 'TalentMarketplace',
            address: process.env.EMAIL_USER
        }
    }
});

module.exports = transporter;