const {validationResult,} = require('express-validator');
const {addMessage} = require("../utils/flashMessage");
const {log} = require('../utils/logger');
const {CustomError} = require('../utils/errors');

function validatorErrorHandler (req, res, next) {
    const errors = validationResult(req);
    console.log('Validating errors...');
    if (!errors.isEmpty()) {
        console.log('Validation error occured :');
        for(errMsg of errors.array()) {
            log(req, 'error', errMsg.msg, {module : 'ValErr Middwre'});
            addMessage(req, 'warning', errMsg.msg);
        }
        return next(new CustomError("Validation failed.", 'warning'));
    }
        return next();
}

module.exports = {
    validatorErrorHandler
};