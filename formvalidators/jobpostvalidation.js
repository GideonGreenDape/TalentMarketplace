const { body } = require('express-validator');

const jobPostValidation = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('job.title').notEmpty().trim().withMessage('Job title required'),
        body('job.description').notEmpty().trim().withMessage('Job description required'),
        body('job.requiredSkills')
            .isArray({ min: 1 })
            .withMessage('At least one required skill needed'),
        body('job.amount')
            .isNumeric()
            .withMessage('Valid amount required')
    ];
};

module.exports = { jobPostValidation };