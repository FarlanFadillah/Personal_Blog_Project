const validator = require('express-validator');

const idValidator  =[
    validator.param('id').isNumeric({min : 1}).withMessage('id must be a number')
];

const titleValidator = [
    validator.body('title')
        .notEmpty().withMessage('title cant be empty')
        .isLength({min : 1, max : 70}).withMessage('title must be at least 1-70 characters long')
        .matches(/^[^<>]*$/).withMessage('title cannot contain html tags')
];

const contentValidator = [
    validator.body('content')
        .notEmpty().withMessage('content cant be empty')
        .matches(/^[^<>]*$/).withMessage('title cannot contain html tags')
]

module.exports = {
    idValidator,
    titleValidator,
    contentValidator,
}