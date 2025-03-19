const { body, validationResult } = require('express-validator');

// Validation rules for talent registration

const emailAndPasswordValidation = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Must be a valid email'),
        body('password')
            .isLength({ min: 6 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character')
    ];
};


// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
  
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };


module.exports = {emailAndPasswordValidation,validate};