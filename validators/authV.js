const validator = require('express-validator');

const loginValidator = [
    validator.body('username').notEmpty().withMessage('Username / Email is required'),
    validator.body('password').notEmpty().withMessage('Password is required')
];

const updateAccountProfileValidator = [
    validator.body('username')
        .isLength({min : 4}).withMessage('Usernames must be at least 4 characters long')
        .notEmpty().withMessage('Username / Email is required')
        .matches(/^[^<>]*$/).withMessage("username can't contain html tags"),

    validator.body('first_name')
        .notEmpty().withMessage('First name is required')
        .matches(/^[^<>]*$/).withMessage("first name can't contain html tags"),

    validator.body('last_name')
        .notEmpty().withMessage('Last name is required')
        .matches(/^[^<>]*$/).withMessage("last name can't contain html tags"),

    validator.body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email not valid"),
]


module.exports = {loginValidator, updateAccountProfileValidator}