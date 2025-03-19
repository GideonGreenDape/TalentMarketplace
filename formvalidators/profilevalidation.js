const { body } = require('express-validator');

const profileValidationRules = () => {
    return [
        body('firstname').trim().notEmpty().withMessage('First name is required'),
        body('lastname').trim().notEmpty().withMessage('Last name is required'),
        body('middlename').optional().trim(),
        body('DOB').isISO8601().withMessage('Invalid date format'),
        body('phone').matches(/^\+?[\d\s-]+$/).withMessage('Invalid phone number'),
        body('city').trim().notEmpty().withMessage('City is required'),
        body('state').trim().notEmpty().withMessage('State is required'),
        body('address').trim().notEmpty().withMessage('Address is required'),
        body('email').isEmail().withMessage('Valid email is required')
    ];
};

module.exports = { profileValidationRules };