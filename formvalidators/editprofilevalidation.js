const { body } = require('express-validator');

const editProfileValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Valid email is required'),
        body('updates').isObject().withMessage('Updates object is required'),
        body('updates.firstname').optional().trim().notEmpty(),
        body('updates.lastname').optional().trim().notEmpty(),
        body('updates.middlename').optional().trim(),
        body('updates.phone').optional().matches(/^\+?[\d\s-]+$/),
        body('updates.city').optional().trim().notEmpty(),
        body('updates.state').optional().trim().notEmpty(),
        body('updates.address').optional().trim().notEmpty(),
        body('updates.hourlyRate').optional().isNumeric(),
        body('updates.isAvailable').optional().isBoolean(),
        body('updates.skills').optional().isObject(),
        body('updates.skillNames').optional().isArray()
    ];
};

module.exports = { editProfileValidationRules };