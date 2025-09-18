const validator = require('express-validator');

const loginValidator = [
    validator.body('username').notEmpty().withMessage('Username / Email is required'),
    validator.body('password').notEmpty().withMessage('Password is required')
];

const accountProfileValidator = [
    validator.body('username')
        .trim()
        .escape()
        .isLength({min : 4}).withMessage('Usernames must be at least 4 characters long')
        .notEmpty().withMessage('Username / Email is required')
        .matches(/^[^<>]*$/).withMessage("username can't contain html tags"),

    validator.body('first_name')
        .trim()
        .escape()
        .notEmpty().withMessage('First name is required')
        .matches(/^[^<>]*$/).withMessage("first name can't contain html tags"),

    validator.body('last_name')
        .trim()
        .escape()
        .notEmpty().withMessage('Last name is required')
        .matches(/^[^<>]*$/).withMessage("last name can't contain html tags"),

    validator.body('email')
        .normalizeEmail()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email not valid"),
]

const passwordValidator = [
    validator.body('password')
        .isLength({min : 8}).withMessage('Password must be at least 8 characters long')
    ,
    validator.body('confirm_password')
        .optional({checkFalsy : true})
        .custom((value, {req}) =>{
            if(req.body.password && value !== req.body.password){
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
]



module.exports = {loginValidator, accountProfileValidator, passwordValidator}