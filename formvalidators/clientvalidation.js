const { body } = require('express-validator');

const personalDetailsValidation = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('firstName').notEmpty().trim().withMessage('First name is required'),
        body('lastName').notEmpty().trim().withMessage('Last name is required'),
        body('phone').matches(/^\+?[\d\s-]+$/).withMessage('Valid phone number required'),
        body('country').notEmpty().trim().withMessage('Country is required'),
        body('languages').isArray().optional().withMessage('Languages must be an array')
    ];
};

const companyDetailsValidation = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('name').notEmpty().trim().withMessage('Company name is required'),
        body('website').isURL().optional().withMessage('Valid website URL required'),
        body('industry').notEmpty().withMessage('Industry is required'),
        body('size').notEmpty().withMessage('Company size is required'),
        body('description').trim().optional()
    ];
};

const paymentDetailsValidation = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('currency').notEmpty().withMessage('Currency is required'),
        body('preferredPaymentMethod').notEmpty().withMessage('Payment method is required'),
        body('billingAddress.street').notEmpty().withMessage('Street address is required'),
        body('billingAddress.city').notEmpty().withMessage('City is required'),
        body('billingAddress.state').notEmpty().withMessage('State is required'),
        body('billingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
        body('billingAddress.country').notEmpty().withMessage('Country is required')
    ];
};

module.exports = {
    personalDetailsValidation,
    companyDetailsValidation,
    paymentDetailsValidation
};