const {validationResult,} = require('express-validator');

function validatorErrorHandler (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed');
        err.status = 400;
        err.details = errors.array();
        return next(err);
    }
        return next();
}

module.exports = {
    validatorErrorHandler
};