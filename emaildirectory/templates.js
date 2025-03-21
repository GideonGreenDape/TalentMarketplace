const templates = {
    welcomeEmail: (userType) => `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <div style="background: #2D3748; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to TalentMarketplace</h1>
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; line-height: 1.5;">Thank you for joining as a <strong>${userType}</strong>!</p>
                <p style="font-size: 16px; line-height: 1.5;">We're excited to have you on board. Here's what you can do next:</p>
                <ul style="padding-left: 20px; line-height: 1.6;">
                    <li>Complete your profile</li>
                    <li>Add your skills and experience</li>
                    <li>Browse available opportunities</li>
                </ul>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="background: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} TalentMarketplace. All rights reserved.</p>
            </div>
        </div>
    `,

    jobApplicationNotification: (jobTitle, freelancerEmail) => `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <div style="background: #2D3748; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                <h2 style="margin: 0; font-size: 24px;">New Application Received</h2>
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="border-left: 4px solid #4A90E2; padding-left: 15px; margin: 20px 0;">
                    <h3 style="margin: 0; color: #4A90E2;">${jobTitle}</h3>
                    <p style="margin: 10px 0; color: #666;">Application from: ${freelancerEmail}</p>
                </div>
                <div style="background: #F8F9FA; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px;">A new freelancer has applied to your job posting. Review their proposal and credentials to make an informed decision.</p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="background: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Application</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} TalentMarketplace. All rights reserved.</p>
            </div>
        </div>
    `,

    jobAwardNotification: (jobTitle, clientEmail) => `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
            <div style="background: #2D3748; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                <h2 style="margin: 0; font-size: 24px;">🎉 Congratulations!</h2>
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="border-left: 4px solid #4CAF50; padding-left: 15px; margin: 20px 0;">
                    <h3 style="margin: 0; color: #4CAF50;">Job Awarded: ${jobTitle}</h3>
                    <p style="margin: 10px 0; color: #666;">Client: ${clientEmail}</p>
                </div>
                <div style="background: #F8F9FA; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px;">The client has selected you for this project. Please review the details and accept the offer to get started.</p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Offer</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} TalentMarketplace. All rights reserved.</p>
            </div>
        </div>
    `
};

module.exports = templates;