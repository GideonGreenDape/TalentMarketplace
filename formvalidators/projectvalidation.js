const { body } = require('express-validator');

const projectValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('project').isObject().withMessage('Project details required'),
        body('project.title').notEmpty().trim().withMessage('Project title required'),
        body('project.description').notEmpty().trim().withMessage('Project description required'),
        body('project.category').notEmpty().withMessage('Project category required'),
        body('project.skillsUsed').isArray().withMessage('Skills used must be an array'),
        body('project.duration').isObject().withMessage('Duration details required'),
        body('project.links').optional().isArray().withMessage('Links must be an array'),
        body('project.client').optional().isObject().withMessage('Client details must be an object')
    ];
};

module.exports= projectValidationRules;