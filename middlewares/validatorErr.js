const {validationResult,} = require('express-validator');
const {addMessage} = require("../utils/flashMessage");
const logger = require('../utils/logger');
const validationLogger = logger.child({module : 'Validation Err'})

function validatorErrorHandler (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation error occured :');
        for(errMsg of errors.array()) {
            validationLogger.error(errMsg.msg);
            addMessage(req, 'error', errMsg.msg);
        }
        return next(new Error("Validation failed."));
    }
        return next();
}

module.exports = {
    validatorErrorHandler
};