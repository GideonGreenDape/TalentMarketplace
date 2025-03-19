const { body } = require('express-validator');

const skillsValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Valid email is required'),
        body('skills').custom((skills) => {
            if (Object.keys(skills).length > 10) {
                throw new Error('Maximum 10 skills allowed');
            }
            return true;
        }),
        body('skillNames').isArray().withMessage('skillNames must be an array'),
        body('hourlyRate').isNumeric().withMessage('Hourly rate must be a number'),
        body('isAvailable').isBoolean().withMessage('Availability must be boolean')
    ];
};

module.exports = { skillsValidationRules };