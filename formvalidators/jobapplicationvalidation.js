const { body } = require('express-validator');

const jobApplicationValidation = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('jobId').isMongoId().withMessage('Valid job ID required'),
        body('proposal').notEmpty().trim().withMessage('Proposal is required'),
    ];
};

module.exports = { jobApplicationValidation };