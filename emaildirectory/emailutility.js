const transporter = require('./emailconfig');
const templates = require('./templates');

const emailService = {

    sendWelcomeEmail: async (userEmail, userType) => {
        try {
            await transporter.sendMail({
                from: {
                    name: process.env.EMAIL_SENDER_NAME,
                    address: process.env.EMAIL_USER
                },
                to: userEmail,
                subject: 'Welcome to TalentMarketplace!',
                html: templates.welcomeEmail(userType)
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    },

    sendApplicationNotification: async (clientEmail, jobTitle, freelancerEmail) => {
        try {
            await transporter.sendMail({
                from:  {
                    name: process.env.EMAIL_SENDER_NAME,
                    address: process.env.EMAIL_USER
                },
                to: clientEmail,
                subject: `New Application for ${jobTitle}`,
                html: templates.jobApplicationNotification(jobTitle, freelancerEmail)
            });

        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    },

    sendJobAwardNotification: async (freelancerEmail, jobTitle, clientEmail) => {
        try {
            await transporter.sendMail({
                from: {
                    name: process.env.EMAIL_SENDER_NAME,
                    address: process.env.EMAIL_USER
                },
                to: freelancerEmail,
                subject: `Congratulations! Job Awarded - ${jobTitle}`,
                html: templates.jobAwardNotification(jobTitle, clientEmail)
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
};

module.exports = emailService;